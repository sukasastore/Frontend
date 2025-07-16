"use client";
import type React from "react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
// Api
import { DEACTIVATE_USER, GET_USER_PROFILE } from "@/lib/api/graphql";
import { useMutation, useQuery } from "@apollo/client";
// Components
import CustomButton from "@/lib/ui/useable-components/button";
import CustomInputSwitch from "@/lib/ui/useable-components/custom-input-switch";
import ProfileSettingsSkeleton from "@/lib/ui/useable-components/custom-skeletons/profile.settings.skelton";
import TextComponent from "@/lib/ui/useable-components/text-field";
import DeleteAccountDialog from "./delete-account";
import UpdatePhoneModal from "./update-phone";
// Context
import { useAuth } from "@/lib/context/auth/auth.context";
// Hooks
import useToast from "@/lib/hooks/useToast";
import NameUpdateModal from "./update-name";

export default function SettingsMain() {

  // States for current values
  const [sendReceipts, setSendReceipts] = useState<boolean>(false);
  const [deleteAccount, setDeleteAccount] = useState<boolean>(false)
  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [deleteReason, setDeleteReason] = useState<string>("")
  const [isUpdatePhoneModalVisible, setIsUpdatePhoneModalVisible] = useState<boolean>(false)
  const [isUpdateNameModalVisible, setIsUpdateNameModalVisible] = useState<boolean>(false)

  // Hooks
  const { setAuthToken } = useAuth();
  const router = useRouter();
   const { showToast } = useToast();

   // Queries and Mutations
  // Get profile data by using the query
  const { data: profileData, loading: isProfileLoading } = useQuery(GET_USER_PROFILE, {
    fetchPolicy: "cache-and-network",
  });
   // Update user muattion 
  const [Deactivate] = useMutation(DEACTIVATE_USER, {
    onCompleted: () => {
        showToast({
            type: "success",
            title: "Success",
            message: "User Account Has Been Deleted Successfully",
        });
    },
    onError: (error) => {
      showToast({
        type: "error",
        title: "Error",
        message: error.message,
      });
    },
  });


  // Handle send receipts toggle
  const handleSendReceiptsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked;
    setSendReceipts(newValue);
    // You can use a mutation to update the user's settings
  };
  //  handle Logout
  const handleLogout = () => {
    // Add your logout logic here
    // e.g., clear cookies, redirect to login page, etc.
    setAuthToken("");
    localStorage.clear();
    showToast({
            type: "success",
            title: "Logout",
            message: "User logged out successfully",
          });
    router.push("/");
  };

  // Handle Delete Account
  const handleDeleteAccount = () => {
    setDeleteAccount(true)
  }

  const handleConfirmDelete = () => {
    setIsDeleting(true)
    // Simulate API call
    setTimeout(() => {
      // Actual Mutation Delete Logic implement here
      Deactivate({
      variables: {
        isActive: false,
        email: profileData?.profile?.email,
      },
    });
      // Clear auth token and local storage
      setAuthToken("");
      localStorage.clear();
      setIsDeleting(false)
      setDeleteAccount(false)
      router.push("/");
    }, 1500)
  }

    // Close delete dialog
    const handleCancelDelete = useCallback(() => {
       setDeleteAccount(false)
    }, []);


    const handleUpdatePhoneModal = () => {
      setIsUpdatePhoneModalVisible(!isUpdatePhoneModalVisible)
    }
    const handleUpdateNameModal = () => {
    setIsUpdateNameModalVisible(!isUpdateNameModalVisible);
    }

  if (isProfileLoading) {
    return <ProfileSettingsSkeleton />;
  }

  return (
    <div className="w-full mx-auto bg-white">
       <DeleteAccountDialog
        visible={deleteAccount}
        onHide={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        userName={profileData?.profile?.name || profileData?.profile?.email?.split("@")[0] || "User"}
        deleteReason={deleteReason}
        setDeleteReason={setDeleteReason}
        loading={isDeleting}
      />
      {/* Email */}
      <div className="py-4 border-b">
        <div className="flex justify-between items-center">
          <TextComponent text="Email" className="font-normal text-gray-700 text-base md:text-lg " />
          <TextComponent text={profileData?.profile?.email} className="font-medium text-gray-700 text-base md:text-lg " />
        </div>
      </div>

      {/* Mobile Number */}
      <div className="py-4 border-b">
        <div className="flex justify-between items-center">
        <TextComponent text="Mobile Number" className="font-normal text-gray-700 text-base md:text-lg " />
      <div className="flex flex-col md:flex-row items-center gap-2">
         {!profileData?.profile?.phoneIsVerified && (
         <CustomButton
         onClick={handleUpdatePhoneModal} 
         label='Not Verified' type='button' className='text-sm md:text-lg font-light bg-[#dd151583] px-[16px] py-[8px] text-white'/>
       )}
        <h1
        title="Update phone number"
        onClick={handleUpdatePhoneModal}
        className="font-medium text-blue-700 text-base md:text-lg  cursor-pointer">{profileData?.profile?.phone || "N/A" }</h1>
      </div>
        </div>
      </div>

      {/* Name */}
      <div className="py-4 border-b">
        <div className="flex justify-between items-center">
        <TextComponent text="Name" className="font-normal text-gray-700 text-base md:text-lg " />
        <h1
        title="Update Name"
        onClick={handleUpdateNameModal}
        className="font-medium text-blue-700 text-base md:text-lg  cursor-pointer"
        >
          {profileData?.profile?.name || "N/A"}
        </h1>
        </div>
      </div>

      {/* Delete Account */}
      <div className="py-4 border-b">
        <div className="flex justify-between items-center">
        <TextComponent text="Delete Account" className="font-normal text-gray-700 text-base md:text-lg " />
          <CustomButton
           label="Delete"
            className="text-red-500 hover:text-red-600 font-medium text-base md:text-lg  "
            onClick={handleDeleteAccount}
          />
              
        </div>
      </div>

      {/* Send Receipts */}
      <div className="py-4 border-b">
        <div className="flex justify-between items-center">
        <TextComponent text="Send receipts to email" className="font-normal text-gray-700 text-base md:text-lg " />
          <CustomInputSwitch
            isActive={sendReceipts}
            onChange={handleSendReceiptsChange}
          />
        </div>
      </div>

      {/* Update Phone Modal */}
       <UpdatePhoneModal
          handleUpdatePhoneModal={handleUpdatePhoneModal}
          isUpdatePhoneModalVisible={isUpdatePhoneModalVisible}
        />

        {/* Upate Name MOdal */}
        <NameUpdateModal 
         handleUpdateNameModal={handleUpdateNameModal}
        isUpdateNameModalVisible={isUpdateNameModalVisible}
        existedName={profileData?.profile?.name}
        />

      {/* Logout */}
      <div className="py-4">
        <div className="flex justify-between items-center">
          <TextComponent text="Log out of app" className="font-normal text-gray-700 text-base md:text-lg " />
          <CustomButton className="font-light text-gray-700 text-base lg:text-lg" onClick={handleLogout}
            label="Logout"
          />
        </div>
      </div>
    </div>
  );
}
