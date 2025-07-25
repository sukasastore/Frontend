"use client";

import { useRouter } from "next/navigation";
import React from "react";

// Components
import TextFlyingAnimation from "@/lib/ui/useable-components/FlyingText";
import HomeSearch from "@/lib/ui/useable-components/Home-search";

// Hooks
import useLocation from "@/lib/hooks/useLocation";
import useSetUserCurrentLocation from "@/lib/hooks/useSetUserCurrentLocation";
import LoginInForSavedAddresses from "@/lib/ui/useable-components/LoginForSavedAddresses";

// imports related to auth module
import { useAuth } from "@/lib/context/auth/auth.context";
import { useConfig } from "@/lib/context/configuration/configuration.context";
import AuthModal from "../../authentication";
import useSingleRestaurant from "@/lib/hooks/useSingleRestaurant";

const Start: React.FC = () => {
  // Hooks
  const router = useRouter();
  const { getCurrentLocation } = useLocation();
  const { onSetUserLocation } = useSetUserCurrentLocation();
  const { isAuthModalVisible, setIsAuthModalVisible, setActivePanel } =
    useAuth();
  const { IS_MULTIVENDOR } = useConfig();

  const { restaurantId, restaurantSlug} = useSingleRestaurant();

  const handleModalToggle = () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      setIsAuthModalVisible((prev) => {
        if (prev) {
          setActivePanel(0);
        }
        return !prev;
      });
    } else {
      router.push("/profile/addresses");
    }
  };

  return (
    <div className="h-[100vh] w-full bg-cover bg-center flex items-center justify-center bg-[#94e469] relative">
      <div className="text-center flex flex-col items-center justify-center">
        <TextFlyingAnimation />
        <h1 className="text-[40px] md:text-[90px] font-extrabold text-white">
          DELIVERED
        </h1>
        <HomeSearch />
        <div className="my-6 text-white flex items-center justify-center">
          <div className="flex items-center gap-2">
            <i
              className="pi pi-map-marker"
              style={{ fontSize: "1rem", color: "white" }}
            ></i>
            <button
              className="me-2 underline"
              onClick={() => {
                getCurrentLocation(onSetUserLocation);
                if(IS_MULTIVENDOR){router.push("/discovery");}
                else {console.log('called'); router.replace(`/store-single-vendor/${restaurantId}/${restaurantSlug}`)}
              }}
            >
              Current Location
            </button>
          </div>
          <LoginInForSavedAddresses handleModalToggle={handleModalToggle} />
        </div>
      </div>

      <svg
        viewBox="0 0 1000 200"
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 w-full h-[100px]"
      >
        <path
          d="M0,100 C500,60 500,60 1000,100 L1000,200 L0,200 Z"
          fill="white"
        />
      </svg>

      <AuthModal
        handleModalToggle={handleModalToggle}
        isAuthModalVisible={isAuthModalVisible}
      />
    </div>
  );
};

export default Start;
