import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../../../Assets/images/logo/gymfox.png";

import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import { ThemeContext } from "../../../Context/ThemeContext";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useForm } from "react-hook-form";
import login, { forgotPassword, sendOtp } from "./authService";
import toast from "react-hot-toast";

function AdminLogin() {
  const { theme } = useContext(ThemeContext);

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);
  const [isForgoting, setIsForgoting] = useState(false);
  const [contact, setContact] = useState();

  const { register, handleSubmit, watch } = useForm();

  function handleAdminLogin(data) {
    login(true, { ...data, role: "admin" }, dispatch, setIsLoading, navigate);
  }

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "mobileNo") {
        setContact(value.mobileNo);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const [isOtpSent, setIsOtpSent] = useState();
  const [otpData, setOtpData] = useState();

  async function handleForgorPassword(data) {
    const res = await sendOtp(
      true,
      setIsLoading,
      { contact: data.mobileNo },
      setIsOtpSent,
    );
    res.data.action && countDown();
  }

  let timer = 30;
  const [resendTime, setResendTime] = useState(30);

  function countDown() {
    const interval = setInterval(() => {
      timer--;
      setResendTime(timer);
      if (timer === 0) {
        clearInterval(interval);
        timer = 30;
        setResendTime(30);
      }
    }, 1000);
  }

  const [otpSubmitLoading, setOtpSubmitLoading] = useState(false);

  function hadleSubmitOtp() {
    const payload = { contact, otp: otpData };
    if (!payload.contact) {
      toast.error("Please provide a contact");
    }
    if (!payload.otp) {
      toast.error("Please enter  otp");
    } else {
      forgotPassword(true, payload, setOtpSubmitLoading, setIsForgoting);
    }
  }

  useEffect(() => {
    // setValue("mobileNo", 8824644769);
    // setValue("password", "Admin@12345");
  }, []);

  return (
    <>
      <div id="login" className={`flex  `}>
        <div className="right p-4 w-full flex items-center justify-center ">
          <div className="mainContainer w-full ">
            <div className="loginFormContainer h-max m-auto overflow-hidden card rounded-md max-w-[440px] w-full">
              <div className={` text-center  pb-5  `}>
                <div
                  className={`bg-white ${
                    theme.isDark ? "p-4" : "p-4 pb-0"
                  }  mb-4`}
                >
                  <img className="w-40 m-auto" src={logo} alt="logo" />
                </div>

                {isForgoting ? (
                  <div className="px-4">
                    <h3 className="text-2xl font-semibold ">
                      {" "}
                      Forgot Password ?
                    </h3>
                    <p>
                      Enter mobile no. and OTP, sent to your registered mobile
                      number to verify your identity.
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-semibold ">Sign In</h3>
                    <p className="">Please Fill Required Login Details</p>
                  </>
                )}
              </div>
              <form
                className="p-5 "
                onSubmit={handleSubmit(
                  isForgoting ? handleForgorPassword : handleAdminLogin,
                )}
              >
                <div className="inputContainer">
                  <div className="inputBox">
                    <input
                      required
                      id={"number"}
                      type={"number"}
                      className={`formControl`}
                      {...register("mobileNo")}
                    />
                    <label htmlFor={"number"}>
                      Mobile No
                      <span className="text-red-600"> *</span>
                    </label>
                  </div>
                </div>
                <div className="flex">
                  <div
                    className={` shrink-0 w-full ${
                      isForgoting
                        ? "opacity-0 pointer-events-none translate-x-[-100%] h-0"
                        : ""
                    } inputContainer transition-all`}
                  >
                    <div className="inputBox">
                      <input
                        required={!isForgoting}
                        id={"password"}
                        type={isShow ? "text" : "password"}
                        className={`formControl  `}
                        {...register("password")}
                      />
                      <label htmlFor={"password"}>
                        Password
                        <span className="text-red-600">*</span>
                      </label>

                      <div
                        onClick={() => {
                          setIsShow(!isShow);
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        {isShow ? <VscEye /> : <VscEyeClosed />}
                      </div>
                    </div>
                  </div>
                  {isOtpSent && (
                    <div
                      className={` shrink-0 w-full ${
                        isForgoting
                          ? " pointer-events-all translate-x-[-100%]"
                          : "opacity-0 pointer-events-none "
                      } inputContainer transition-all`}
                    >
                      <div className="inputBox">
                        <input
                          className={`formControl  `}
                          onChange={(e) => {
                            setOtpData(e.target.value);
                          }}
                          value={otpData}
                        />
                        <label htmlFor={"Otp"}>
                          Enter Otp
                          <span className="text-red-600"> *</span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                <div className="forgotPassword">
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgoting(!isForgoting);
                    }}
                    className="text-sm underline mb-5 hover:text-blue-700 block text-end w-max ms-auto mt-2"
                  >
                    {isForgoting ? "Sign In ?" : "  Forgot Password ?"}
                  </button>
                </div>

                {!isForgoting ? (
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="themeButton textWhite w-full hover:shadow-lg"
                  >
                    {isLoading ? <LoaderSpiner hw={20} /> : "Sign In"}
                  </button>
                ) : (
                  <div className="flex gap-3 items-center">
                    {isOtpSent && (
                      <button
                        disabled={otpSubmitLoading || !otpData || !contact}
                        type="button"
                        onClick={hadleSubmitOtp}
                        className={` ${
                          !otpData || !contact
                            ? "opacity-55 cursor-not-allowed"
                            : ""
                        } themeButton textWhite w-full hover:shadow-lg`}
                      >
                        {otpSubmitLoading ? (
                          <LoaderSpiner hw={20} />
                        ) : (
                          <span>Submit</span>
                        )}
                      </button>
                    )}
                    <button
                      disabled={isLoading || resendTime < 30}
                      type="submit"
                      className={`themeButton textWhite w-full hover:shadow-lg ${
                        resendTime < 30 ? "cursor-not-allowed" : ""
                      }`}
                    >
                      {isLoading ? (
                        <LoaderSpiner hw={20} />
                      ) : (
                        <span>
                          {" "}
                          {resendTime < 30 ? (
                            <span className="font-normal text-sm">
                              Re-send OTP in {resendTime} Sec
                            </span>
                          ) : (
                            "  Send OTP"
                          )}{" "}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
