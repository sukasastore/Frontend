export default function getEnv(env: "DEV" | "PROD") {
  if (env === "PROD" || typeof window === "undefined") {
    return {
      // SERVER_URL: "https://enatega-multivendor-revamp.up.railway.app/",
      // WS_SERVER_URL: "wss://enatega-multivendor-revamp.up.railway.app/",
      // SERVER_URL: "https://enatega-multivendor.up.railway.app/",
      // WS_SERVER_URL: "wss://enatega-multivendor.up.railway.app/",
      SERVER_URL: "https://v1-api-enatega-single-multivendor.up.railway.app/",
      WS_SERVER_URL: "wss://v1-api-enatega-single-multivendor.up.railway.app/",
      // SERVER_URL: "http://localhost:8001/",
      // WS_SERVER_URL: "ws://localhost:8001/",
    };
  } else {
    return {
      SERVER_URL: "https://v1-api-enatega-single-multivendor.up.railway.app/",
      WS_SERVER_URL: "wss://v1-api-enatega-single-multivendor.up.railway.app/",
      // SERVER_URL: "https://enatega-multivendor-revamp.up.railway.app/",
      // WS_SERVER_URL: "wss://enatega-multivendor-revamp.up.railway.app/",
    };
  }
}
