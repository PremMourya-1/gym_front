import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { useForm } from "react-hook-form";
import login, { forgotPassword, sendOtp } from "../../Admin/Auth/authService";
import { toast } from "react-toastify";

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isShow, setIsShow] = useState(false);

  const { register, handleSubmit, watch } = useForm();

  const [isForgoting, setIsForgoting] = useState(false);
  const [contact, setContact] = useState();

  function handleUserLogin(data) {
    const isAdmin = false;
    login(isAdmin, data, dispatch, setIsLoading, navigate);
  }

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "phone") {
        setContact(value.phone);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const [isOtpSent, setIsOtpSent] = useState();
  const [otpData, setOtpData] = useState();

  async function handleForgorPassword(data) {
    const res = await sendOtp(
      false,
      setIsLoading,
      { contact: data.contact },
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
      toast.error("Please enter otp");
    } else {
      forgotPassword(false, payload, setOtpSubmitLoading, setIsForgoting);
    }
  }

  useEffect(() => {
    // setValue("phone", 8824644769);
    // setValue("password", "123");
  }, []);

  return (
    <div
      id="userLoginBg"
      className="min-h-screen flex items-center justify-center bg-[var(--background-light)] dark:bg-[var(--background-dark)] p-4"
    >
      {/* <div className="w-full max-w-[420px] bg-[var(--background-dark)] border border-[#4a4949] shadow-xl rounded-xl overflow-hidden"> */}
      <div className="relative w-full max-w-[420px] rounded-xl overflow-hidden">
        {/* Corner shines */}
        <span className="corner-shine top-left"></span>
        <span className="corner-shine top-right"></span>
        <span className="corner-shine bottom-left"></span>
        <span className="corner-shine bottom-right"></span>

        <div
          className="
    w-full
    bg-[rgba(40,40,41,0.63)]
    border border-[rgba(255,255,255,0.08)]
    shadow-[0_20px_60px_rgba(0,0,0,0.45)]
    rounded-xl
    overflow-hidden
  "
        >
          {/* card content */}
          <div
            className="
  w-full max-w-[420px]
  bg-[rgba(255,255,255,0.35)]
  bg-[rgba(40,40,41,0.63)]

  border border-[rgba(255,255,255,0.25)] dark:border-[rgba(255,255,255,0.08)]
  shadow-[0_20px_60px_rgba(0,0,0,0.45)]
  rounded-xl
  overflow-hidden
"
          >
            {/* Logo */}
            {/* <div className="text-center py-3 border-b border-[#4a4949] ">
              <img
                className="w-[340px] m-auto drop-shadow-lg"
                src={logo}
                alt="logo"
              />
            </div> */}

            <div className="p-8 pb-3 text-center ">
              {isForgoting ? (
                <>
                  <h3 className="text-xl font-bold tracking-wider text-white">
                    RESET PASSWORD
                  </h3>
                  <p className="text-[var(--muted)] text-sm mt-2">
                    Enter mobile number and OTP
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold tracking-wider text-white uppercase">
                    Softway x Gym management
                    <br />
                    LOGIN
                    {/* GYM LOGIN */}
                  </h3>
                </>
              )}
            </div>

            <form
              className="px-8 pb-8 pt-6"
              onSubmit={handleSubmit(
                isForgoting ? handleForgorPassword : handleUserLogin,
              )}
            >
              {/* Mobile */}
              <div className="mb-3">
                <label className="text-sm text-[var(--text-light)] block mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  className="w-full bg-[var(--background-light)] dark:bg-[var(--background-dark)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-[var(--primary)] outline-none text-[var(--text)] dark:text-[var(--text-white)]"
                  {...register("phone")}
                  required
                />
              </div>

              {/* Password */}
              <div className="flex mb-4">
                <div
                  className={`w-full transition-all ${
                    isForgoting
                      ? "opacity-0 pointer-events-none -translate-x-full h-0"
                      : ""
                  }`}
                >
                  <div className="mb-3  ">
                    <label className="text-sm  text-[var(--text-light)] block mb-1">
                      Password
                    </label>
                    <div className="box relative">
                      <input
                        type={isShow ? "text" : "password"}
                        className="w-full bg-[var(--background-light)] dark:bg-[var(--background-dark)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-[var(--primary)] outline-none text-[var(--text)] dark:text-[var(--text-white)]"
                        {...register("password")}
                        required={!isForgoting}
                      />

                      <div
                        onClick={() => setIsShow(!isShow)}
                        className="absolute right-3 top-1/2  -translate-y-1/2 cursor-pointer text-[var(--muted)]"
                      >
                        {isShow ? <VscEye /> : <VscEyeClosed />}
                      </div>
                    </div>
                  </div>
                </div>

                {isOtpSent && (
                  <div
                    className={`w-full transition-all ${
                      isForgoting
                        ? "pointer-events-all -translate-x-full"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <div className="mb-3">
                      <label className="text-sm text-[var(--text-light)] block mb-1">
                        Enter OTP
                      </label>
                      <input
                        className="w-full bg-[var(--background-light)] dark:bg-[var(--background-dark)] border border-[var(--border)] rounded-lg px-4 py-3 focus:border-[var(--primary)] outline-none text-[var(--text)] dark:text-[var(--text-white)]"
                        value={otpData}
                        onChange={(e) => setOtpData(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Forgot */}
              {/* <button
                type="button"
                onClick={() => setIsForgoting(!isForgoting)}
                className="text-sm text-[var(--muted)] hover:text-[var(--primary)] underline mb-6 block ml-auto"
              >
                {isForgoting ? "Back to Login" : "Forgot Password ?"}
              </button> */}

              {/* Buttons */}
              {!isForgoting ? (
                <button
                  disabled={isLoading}
                  type="submit"
                  className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white transition py-3 rounded-lg font-semibold shadow-md"
                >
                  {isLoading ? <LoaderSpiner hw={20} /> : "LOGIN"}
                </button>
              ) : (
                <div className="flex gap-3">
                  {isOtpSent && (
                    <button
                      disabled={otpSubmitLoading || !otpData || !contact}
                      type="button"
                      onClick={hadleSubmitOtp}
                      className="w-full bg-[var(--primary)] text-white py-3 rounded-lg font-semibold disabled:opacity-50 "
                    >
                      {otpSubmitLoading ? (
                        <LoaderSpiner hw={20} />
                      ) : (
                        "Submit OTP"
                      )}
                    </button>
                  )}

                  <button
                    disabled={isLoading || resendTime < 30}
                    type="submit"
                    className="w-full bg-[var(--primary)] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                  >
                    {isLoading ? (
                      <LoaderSpiner hw={20} />
                    ) : resendTime < 30 ? (
                      <span className="text-sm">
                        Re-send OTP in {resendTime}s
                      </span>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 text-center text-[var(--muted)] text-sm">
                Smart{" "}
                <span className="text-[var(--primary)] font-semibold">
                  gym management
                </span>{" "}
                for members and staff.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
