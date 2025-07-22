// Environment
import getEnv from "@/environment";

// Apollo
import {
  ApolloClient,
  ApolloLink,
  concat,
  createHttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  Operation,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error"; // Import onError utility
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";

// GQL
import { SubscriptionClient } from "subscriptions-transport-ws";

// Utility imports
import { Subscription } from "zen-observable-ts";
import { ENV } from "../utils/constants";

export const useSetupApollo = (): ApolloClient<NormalizedCacheObject> => {
  const { SERVER_URL, WS_SERVER_URL } = getEnv(ENV);

  const cache = new InMemoryCache();

  const httpLink = createHttpLink({
    uri: `${SERVER_URL}graphql`,
  });

  // WebSocketLink with error handling
  const wsLink = new WebSocketLink(
    new SubscriptionClient(`${WS_SERVER_URL}graphql`, {
      reconnect: true,
      timeout: 30000,
      lazy: true,
    })
  );

  // Error Handling Link using ApolloLink's onError (for network errors)
  const errorLink = onError(({ networkError, graphQLErrors }) => {
    if (networkError) {
      console.error("Network Error:", networkError);
    }

    if (graphQLErrors) {
      (graphQLErrors || [])?.forEach((error) =>
        console.error("GraphQL Error:", error?.message)
      );
    }
  });

  const request = async (operation: Operation): Promise<void> => {
    // const data = localStorage.getItem(`user-${APP_NAME}`);
    // Set This Token empty later...
    // let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2N2U2OThjZDFkNmFkNmZkMmMyZTk5NWQiLCJlbWFpbCI6ImR1bW15Y3VzdG9tZXIwNkBnbWFpbC5jb20iLCJpYXQiOjE3NDMxNjU2NDV9.XcOHtJtdb55PK6Bgwf2WZnWPHzkuH4vgFwq4yi8RWbA";
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    operation.setContext({
      headers: {
        authorization: (token ?? "") ? `Bearer ${token ?? ""}` : "",
        userId: userId ?? "",
        isAuth: !!token,
      },
    });
  };

  // Request Link
  const requestLink = new ApolloLink(
    (operation, forward) =>
      new Observable((observer) => {
        let handle: Subscription | undefined;
        Promise.resolve(operation)
          .then((oper) => request(oper))
          .then(() => {
            handle = forward(operation).subscribe({
              next: observer.next.bind(observer),
              error: observer.error.bind(observer),
              complete: observer.complete.bind(observer),
            });
          })
          .catch(observer.error.bind(observer));

        return () => {
          if (handle) handle.unsubscribe();
        };
      })
  );

  // Terminating Link for split between HTTP and WebSocket
  const terminatingLink = split(({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  }, wsLink);

  const client = new ApolloClient({
    link: concat(
      ApolloLink.from([errorLink, terminatingLink, requestLink]),
      httpLink
    ),
    cache,
    connectToDevTools: true,
  });

  return client;
};
