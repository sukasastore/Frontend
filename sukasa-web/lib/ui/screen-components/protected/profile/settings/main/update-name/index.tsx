"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
// Api
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_USER_PROFILE, UPDATE_USER } from "@/lib/api/graphql";
// Components
import CustomDialog from "@/lib/ui/useable-components/custom-dialog";
import CustomButton from "@/lib/ui/useable-components/button";
// Icons
import { LaptopSvg } from "@/lib/utils/assets/svg";
// Hooks
import useToast from "@/lib/hooks/useToast";
import useDebounceFunction from "@/lib/hooks/useDebounceForFunction";
interface UserFormData {
  firstName: string;
  lastName: string;
}

export default function NameUpdateModal({
  isUpdateNameModalVisible,
  handleUpdateNameModal,
  existedName
}: {
  isUpdateNameModalVisible: boolean;
  handleUpdateNameModal: () => void;
  existedName: string;
}) {

  // States
  const nameParts = existedName?.trim().split(" ") || [];
  const [firstName, ...rest] = nameParts;
  const lastName = rest.join(" ");
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
  });

  // Hooks    
  const { showToast } = useToast();

  // Queries and Mutations

  // refetch user profile after updating name
  const [
    fetchProfile
  ] = useLazyQuery(GET_USER_PROFILE, {
    fetchPolicy: "network-only",
  });

  // Update user muattion 
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      fetchProfile()
      showToast({
        type: "success",
        title: "Success",
        message: "User profile updated successfully",
      });
      handleUpdateNameModal?.();
    },
    onError: (error) => {
      showToast({
        type: "error",
        title: "Error",
        message: error.message,
      });
    },
  });

  // handlers
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle submit
  const handleSubmit = useDebounceFunction(() => {
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    updateUser({
      variables: {
        name: fullName,
      },
    });
  },
    500 // Debounce time in milliseconds
  );

  // Handle cancel
  const handleCancel = () => {
    // Reset form or navigate back
    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
    });
    handleUpdateNameModal?.()
  };

  // useeffects

  useEffect(() => {
    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
    });
  }, [existedName]);

  return (
    <CustomDialog
      visible={isUpdateNameModalVisible}
      onHide={handleUpdateNameModal}
      width="600px"
    >
      <div className="flex flex-col  items-center  p-4">
        <div className=" flex items-center justify-center">
          <LaptopSvg width={250} height={250} />
        </div>
        <div className="w-full">
          <div className="">
            <h2 className="text-2xl font-extrabold mb-10 text-black">Name</h2>
            <div className="p-float-label mb-6">
              <InputText
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-300 rounded-md"
              />
              <label htmlFor="firstName">First name</label>
            </div>
            <div className="p-float-label">
              <InputText
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-3 border-2 border-gray-300 rounded-md"
              />
              <label htmlFor="lastName">Last name</label>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full justify-between  gap-2 md:gap-0 px-4 ">
        <CustomButton
          label={"Cancel"}
          className="bg-white flex items-center justify-center rounded-full border border-gray-300 p-3 w-full md:w-[268px] h-14 text-lg font-medium"
          onClick={handleCancel}
        />

        <CustomButton
          label={"Save"}
          className="bg-[#5AC12F] text-white flex items-center justify-center rounded-full p-3 w-full md:w-[268px] mb-4 h-14 text-lg font-medium"
          onClick={handleSubmit}
        />
      </div>
    </CustomDialog>
  );
}
