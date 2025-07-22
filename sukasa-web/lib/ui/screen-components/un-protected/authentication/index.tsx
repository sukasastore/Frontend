"use client";
// Interfaces
import {
  IAuthFormData,
  IAuthModalProps,
  ILoginProfile,
} from "@/lib/utils/interfaces";

// Hooks
import { useAuth } from "@/lib/context/auth/auth.context";
import { useGoogleLogin } from "@react-oauth/google";
import { useRef, useState } from "react";
// import { useTranslations } from "next-intl";

//Prime React
import { Dialog } from "primereact/dialog";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";

// Components
import { useConfig } from "@/lib/context/configuration/configuration.context";
import useToast from "@/lib/hooks/useToast";
import EmailVerification from "./email-verification";
import EnterPassword from "./enter-password";
import LoginWithEmail from "./login-with-email";
import LoginWithGoogle from "./login-with-google";
import PhoneVerification from "./phone-verification";
import SaveEmailAddress from "./save-email-address";
import SavePhoneNumber from "./save-phone-number";
import SignUpWithEmail from "./signup-with-email";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ChangePassword from "./change-password";
import VerificationEmailForChangePassword  from "./change-password/email-otp";

export default function AuthModal({
  isAuthModalVisible,
  handleModalToggle,
}: IAuthModalProps) {
  // States
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [formData, setFormData] = useState<IAuthFormData>({
    email: "",
    password: "",
    name: "",
    phone: "",
  });

  // Refs
  const authenticationPanelRef = useRef(null);

  // Hooks
  const {
    handleUserLogin,
    activePanel,
    setActivePanel,
    setUser,
    setIsAuthModalVisible,
    setIsLoading,
    sendOtpToEmailAddress,
    
  } = useAuth();
  const { showToast } = useToast();
  const { SKIP_EMAIL_VERIFICATION, SKIP_MOBILE_VERIFICATION } = useConfig();

  // Login With Google
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
      );
      const userData = await userInfo.json();

      const userLoginResponse = await handleUserLogin({
        type: "google",
        email: userData.email,
        name: userData.name,
        notificationToken: "",
      });

      if (userLoginResponse) {
        setUser(userLoginResponse.login as ILoginProfile);
        if (
          !userLoginResponse.login.emailIsVerified &&
          SKIP_EMAIL_VERIFICATION
        ) {
          setActivePanel(5);
        } else if (
          !userLoginResponse.login.phoneIsVerified &&
          SKIP_MOBILE_VERIFICATION
        ) {
          setActivePanel(4);
        } else {
          setActivePanel(0);
          setIsAuthModalVisible(false);

          showToast({
            type: "success",
            title: "Login",
            message: "You have logged in successfully",
          });
        }
        setIsLoading(false);
      }
    },

    onError: (errorResponse) => {
      console.log(errorResponse);
    },
  });

  // Handlers
  const handleChangePanel = (index: number) => {
    setActivePanel(index);
  };

  const handleFormChange = (name: string, value: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleResendEmailOtp = () => {
    sendOtpToEmailAddress(formData?.email || "", "password-recovery");
  };

  const handleSubmitAfterVerification = () => {
    setActivePanel(9);
    // setIsAuthModalVisible(false);
    showToast({
      type: "success",
      title: "Password Recovery",
      message: "Update your password now",
    });
  };

  return (
    <Dialog
      visible={isAuthModalVisible}
      closeIcon
      onHide={handleModalToggle}
      closable={activePanel <= 3}
      contentStyle={{
        padding: "22px",
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
      }}
      headerStyle={{
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        height: "fit-content",
      }}
      className={
        activePanel == 6 || activePanel == 3 || activePanel == 4 ?
          "lg:w-1/2 w-full h-auto"
        : "lg:w-1/3 w-full max-w-[400px] h-auto mx-4"
      }
      closeOnEscape={activePanel <= 3}
      showHeader={false}
    >
      {/* close icon to close the modal */}
      <button
        onClick={handleModalToggle}
        className="absolute top-3 right-0 transition-all duration-300 rounded-full p-2"
      >
        <FontAwesomeIcon
          size="lg"
          icon={faXmark}
          className="text-black"
          width={30}
          height={30}
        />
      </button>
      <Stepper ref={authenticationPanelRef} activeStep={activePanel} >
        <StepperPanel>
          <LoginWithGoogle
            googleLogin={googleLogin}
            handleChangePanel={handleChangePanel}
            handleFormChange={handleFormChange}
            formData={formData}
          />
        </StepperPanel>

        <StepperPanel>
          <LoginWithEmail
            handleChangePanel={handleChangePanel}
            handleFormChange={handleFormChange}
            formData={formData}
          />
        </StepperPanel>

        <StepperPanel>
          <SignUpWithEmail
            handleChangePanel={handleChangePanel}
            handleFormChange={handleFormChange}
            formData={formData}
          />
        </StepperPanel>

        <StepperPanel>
          <EmailVerification
            handleChangePanel={handleChangePanel}
            emailOtp={emailOtp}
            setEmailOtp={setEmailOtp}
          />
        </StepperPanel>
        <StepperPanel>
          <SavePhoneNumber />
        </StepperPanel>
        <StepperPanel>
          <SaveEmailAddress handleChangePanel={handleChangePanel} />
        </StepperPanel>
        <StepperPanel>
          <PhoneVerification
            handleChangePanel={handleChangePanel}
            phoneOtp={phoneOtp}
            setPhoneOtp={setPhoneOtp}
          />
        </StepperPanel>
        <StepperPanel>
          <EnterPassword
            formData={formData}
            setFormData={setFormData}
            handleChangePanel={handleChangePanel}
            handleFormChange={handleFormChange}
          />
        </StepperPanel>
        <StepperPanel>
          <VerificationEmailForChangePassword
            handleSubmitAfterVerification={()=>handleSubmitAfterVerification()}
            handleResendEmailOtp={handleResendEmailOtp}
            emailOtp={emailOtp}
            setEmailOtp={setEmailOtp}
            formData={formData}
          />
        </StepperPanel>
        <StepperPanel>
         <ChangePassword handleChangePanel={handleChangePanel} handleFormChange={handleFormChange} formData={formData} setFormData={setFormData}/>
        </StepperPanel>
      </Stepper>
    </Dialog>
  );
}
