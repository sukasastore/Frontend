"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
// Components
import OrderCardSkeleton from "@/lib/ui/useable-components/custom-skeletons/order.card.skelton";
import OrderCard from "@/lib/ui/useable-components/order-card";
import EmptyState from "@/lib/ui/useable-components/orders-empty-state";
import RatingModal from "../rating/main";
import TextComponent from "@/lib/ui/useable-components/text-field";
// Interfaces
import {
  IOrder,
  IPastOrdersProps,
} from "@/lib/utils/interfaces/orders.interface";
// Hooks
import useToast from "@/lib/hooks/useToast";
// Querys and Mutations
import { useMutation } from "@apollo/client";
import { ADD_REVIEW_ORDER } from "@/lib/api/graphql/mutations";
// Methods
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";

export default function PastOrders({
  pastOrders,
  isOrdersLoading,
}: IPastOrdersProps) {
  // states
  const [showRatingModal, setShowRatingModal] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);

  // hooks
  const router = useRouter();
  const { showToast } = useToast();

  //mutation
  const [mutate, { loading: isloadingReviewOrder }] = useMutation(
    ADD_REVIEW_ORDER,
    {
      onCompleted,
      onError,
    }
  );

  function onCompleted() {
    showToast({
      type: "success",
      title: "Rating",
      message: "Rating submitted successfully",
      duration: 3000,
    });
    setSelectedOrder(null);
  }
  function onError() {
    showToast({
      type: "error",
      title: "Rating",
      message: "Failed to submit rating",
      duration: 3000,
    });
    setSelectedOrder(null);
  }

  // const slug =pastOrders[0]?.restaurant?.slug;

  //Handlers
  // use debouncefunction if user click multiple times at once it will call function only 1 time
  const handleReOrderClicked = useDebounceFunction(
    (restaurantId: string | undefined, slug: string | undefined,shopType: string | undefined) => {
      router.push(`/${shopType == "restaurant" ? "restaurant" : "store"  }/${slug}/${restaurantId}`);
    },
    500 // Debounce time in milliseconds
  );

  // handle rate order clicked
  // use debouncefunction if user click multiple times at once it will call function only 1 time
  // this function will set the selected order and show the rating modal
  // and also find the order by id
  const handleRateOrderClicked = useDebounceFunction(
    (orderId: string | undefined) => {
      // Find the order by ID
      const order = pastOrders.find((order) => order._id === orderId);
      if (order) {
        setSelectedOrder(order);
        setShowRatingModal(true);
      }
    },
    500 // Debounce time in milliseconds
  );

  // handle submit rating
  const handleSubmitRating = async (
    orderId: string | undefined,
    ratingValue: number,
    comment?: string
  ) => {
    // Temporarily console the aspects-
    // console.log(aspects, "Temporarily consoling aspects");

    // Here you would  call an API to save the rating
    try {
      await mutate({
        variables: {
          order: orderId,
          description: comment,
          rating: ratingValue,
        },
      });
    } catch (error) {
      console.error("Error submitting rating:", error);
    }

    // Close the modal
    setShowRatingModal(false);
    setSelectedOrder(null);
  };

  // If ordersLoading display skelton  component of orderCardSkelton
  if (isOrdersLoading) {
    return <OrderCardSkeleton count={2} />;
  }

  // If no orders display component of emptyState and pass props
  if (pastOrders?.length === 0) {
    return (
      <EmptyState
        // icon="fa-solid fa-receipt"
        title="No Past Orders"
        message="You haven't placed any orders yet."
        actionLabel="Browse Store"
        actionLink="/store"
      />
    );
  }

  return (
    <>
      <div className="space-y-4 py-4">
        <TextComponent
          text="Past Orders"
          className="text-xl md:text-2xl  font-semibold mb-6"
        />
        <div className="space-y-4">
          {pastOrders?.map((order: IOrder) => (
            <OrderCard
              key={order._id}
              order={order}
              handleReOrderClicked={handleReOrderClicked}
              handleRateOrderClicked={handleRateOrderClicked}
              type="past"
              className="border border-gray-200 rounded-lg shadow-sm"
            />
          ))}
        </div>
      </div>
      {/* Rating Modal */}
      {/* conditionally render the modal based on the loading state of mutation for better user experience */}
      {!isloadingReviewOrder && !selectedOrder?.review?.rating && (
        <RatingModal
          visible={showRatingModal}
          onHide={() => setShowRatingModal(false)}
          order={selectedOrder}
          onSubmitRating={handleSubmitRating}
        />
      )}
    </>
  );
}
