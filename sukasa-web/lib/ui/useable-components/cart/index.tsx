"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { useQuery, useApolloClient } from "@apollo/client";
import { RELATED_ITEMS, FOOD } from "@/lib/api/graphql";

// Hooks
import useUser from "@/lib/hooks/useUser";
import { useConfig } from "@/lib/context/configuration/configuration.context";

interface CartProps {
    onClose?: () => void;
}

export default function Cart({ onClose }: CartProps) {
    // Access user context for cart functionality
    const {
        cart,
        cartCount,
        updateItemQuantity,
        calculateSubtotal,
        restaurant: restaurantId,
        addItem,
    } = useUser();
    const { CURRENCY_SYMBOL } = useConfig();
    const [instructions, setInstructions] = useState(
        localStorage.getItem("orderInstructions") || ""
    );

    const router = useRouter();
    const client = useApolloClient();

    // Format subtotal for display
    const formattedSubtotal =
        cartCount > 0
            ? `${CURRENCY_SYMBOL}${calculateSubtotal()}`
            : `${CURRENCY_SYMBOL}0`;

    // Get first item's ID for related items query (if cart is not empty)
    const firstCartItemId = cart.length > 0 ? cart[0]._id : null;

    // Fetch related items
    const { data: relatedItemsData } = useQuery(RELATED_ITEMS, {
        variables: {
            itemId: firstCartItemId || "",
            restaurantId: restaurantId || "",
        },
        skip: !firstCartItemId || !restaurantId,
    });

    // Handle adding related item to cart
    const handleAddRelatedItem = (id: string) => {
        // Use Apollo Client to read the food fragment
        const food = client.readFragment({
            id: `Food:${id}`,
            fragment: FOOD,
        });

        if (food) {
            // Assuming first variation for simplicity
            const variation = food.variations[0];
            addItem(
                food._id,
                variation._id,
                restaurantId || "",
                "1" // default quantity
            );
        }
    };

    // Empty cart state
    if (cart.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="font-inter font-semibold text-xl text-gray-900 mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Add items to your cart to continue
                    </p>
                    <button
                        onClick={async () => {
                            if (onClose) {
                                await onClose();
                            }
                            // Add 300ms delay (for modal animation or smooth UX)
                            await new Promise((resolve) =>
                                setTimeout(resolve, 300)
                            );

                            router.push("/discovery", { scroll: true });
                        }}
                        className="bg-[#5AC12F] text-black px-6 py-2 rounded-full font-medium"
                        type="button"
                    >
                        Browse Restaurant
                    </button>
                </div>
            </div>
        );
    }

    // Slice related items to max 3
    const slicedRelatedItems = (relatedItemsData?.relatedItems || []).slice(
        0,
        3
    );

    return (
        <div className="h-full flex flex-col bg-white relative">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-inter font-semibold text-xl text-gray-900">
                    Your order
                </h2>
                <span className="text-gray-500 text-sm">
                    {cartCount} {cartCount === 1 ? "item" : "items"}
                </span>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
                {/* Cart Items */}
                <div className="p-4 space-y-4">
                    {cart.map((item) => (
                        <div
                            key={item.key}
                            className="flex sm:flex-row sm:items-center bg-white rounded-lg p-3 shadow-sm"
                        >
                            <div className="flex-grow">
                                <div className="flex sm:flex-row flex-col sm:items-center gap-4">
                                    <img
                                        src={item.image}
                                        alt="item image"
                                        className="w-28 h-28 object-cover rounded-md mb-2"
                                    />
                                    <div>
                                        <h3 className="font-inter font-semibold text-sm text-gray-700">
                                            {item.foodTitle ||
                                                item.title ||
                                                "Food Item"}
                                        </h3>
                                        <p className="text-[#0EA5E9] font-semibold text-sm">
                                            {CURRENCY_SYMBOL}
                                            {item.price || 0}
                                        </p>
                                    </div>
                                </div>
                                {item.optionTitles &&
                                    item.optionTitles.length > 0 && (
                                        <div className="text-xs text-gray-500 mt-1">
                                            {item.optionTitles.map(
                                                (title, index) => (
                                                    <span
                                                        key={index}
                                                        className="mr-2"
                                                    >
                                                        + {title}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    )}
                            </div>

                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        updateItemQuantity(item.key, -1);
                                    }}
                                    className="bg-gray-200 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center"
                                    type="button"
                                >
                                    <FontAwesomeIcon icon={faMinus} size="xs" />
                                </button>

                                <span className="text-gray-900 w-6 text-center">
                                    {item.quantity}
                                </span>

                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        updateItemQuantity(item.key, 1);
                                    }}
                                    className="bg-[#0EA5E9] text-white rounded-full w-6 h-6 flex items-center justify-center"
                                    type="button"
                                >
                                    <FontAwesomeIcon icon={faPlus} size="xs" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Recommended for You Section */}
                {slicedRelatedItems.length > 0 && (
                    <div className="p-4 bg-gray-50">
                        <h2 className="font-inter font-semibold text-base text-gray-900 mb-3">
                            Recommended for you
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {slicedRelatedItems.map((id: string) => {
                                // Read the food fragment using Apollo Client
                                const food = client.readFragment({
                                    id: `Food:${id}`,
                                    fragment: FOOD,
                                });

                                if (!food) return null;

                                return (
                                    <div
                                        key={id}
                                        onClick={() => handleAddRelatedItem(id)}
                                        className="flex-grow basis-[calc(50%-0.75rem)] bg-white rounded-lg overflow-hidden relative 
                    transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg cursor-pointer group"
                                    >
                                        {food.image && (
                                            <img
                                                src={food.image}
                                                alt={food.title}
                                                className="w-full h-36 object-cover group-hover:opacity-80 transition-opacity duration-300"
                                            />
                                        )}
                                        <div className="p-2">
                                            <p className="text-sm font-semibold text-gray-700 truncate">
                                                {food.title}
                                            </p>
                                            <p className="text-[#0EA5E9] text-sm font-semibold">
                                                {CURRENCY_SYMBOL}
                                                {food.variations[0].price}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Add Comment Section */}
                <div className="p-4 bg-white">
                    <div className="bg-gray-50 rounded-lg p-3">
                        <h2 className="font-inter font-semibold text-base text-gray-900 mb-2">
                            Add comment for Restaurant
                        </h2>
                        <textarea
                            id="instructions"
                            className="w-full h-20 p-2 bg-white border border-gray-300 rounded-md resize-none focus:border-[#0EA5E9] focus:outline-none text-sm"
                            placeholder="Special requests, allergies, dietary restrictions..."
                            onChange={({ target: { value } }) => {
                                if (value?.length > 500) return;
                                localStorage.setItem(
                                    "orderInstructions",
                                    value
                                );
                                setInstructions(value);
                            }}
                            value={instructions}
                        />
                        <div className="flex items-end justify-between mt-2">
                            <span className="text-red-500 text-xs">
                                {instructions?.length >= 500 &&
                                    "Maximum limit reached"}
                            </span>
                            <span className="text-xs text-gray-500">
                                {instructions.length}/500
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Checkout Button */}
            <div className="p-4 border-t bg-white">
                <button
                    className="flex justify-between items-center w-full bg-[#5AC12F] text-black rounded-full px-4 py-3"
                    onClick={() => {
                        router.push("/order/checkout");
                        if (onClose) onClose();
                    }}
                    type="button"
                >
                    <div className="flex items-center">
                        <span className="bg-black text-[#5AC12F] rounded-full w-6 h-6 flex items-center justify-center mr-2 text-sm font-medium">
                            {cartCount}
                        </span>
                        <span className="text-black text-base font-medium">
                            Go to Checkout
                        </span>
                    </div>
                    <span className="text-black text-base font-medium">
                        {formattedSubtotal}
                    </span>
                </button>
            </div>
        </div>
    );
}
