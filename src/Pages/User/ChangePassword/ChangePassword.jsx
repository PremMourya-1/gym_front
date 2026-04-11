import { useState } from "react";
import { useForm } from "react-hook-form";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import changePassword from "./passwordService";
import { useDispatch } from "react-redux";
import { logout } from "../../Admin/Auth/authService";
import { toast } from "react-toastify";
import { useLocation } from "react-router";

function ChangePassword() {
  const isAdmin = useLocation().pathname.split("/")[1] === "admin";

  const [show, setShow] = useState({
    oldPas: false,
    newPass: false,
    conPas: false,
  });

  const {
    register,
    // formState: { errors },
    handleSubmit,
  } = useForm();

  const dispatch = useDispatch();

  async function handleChangePassword(data) {
    const res = await changePassword(isAdmin, data);
    if (res.data.action) {
      toast.success(res.data.message);
      setTimeout(() => {
        logout(isAdmin, dispatch);
      }, 2000);
    } else toast.error(res.data.message);
    return res;
  }

  return (
    <>
      <div className="card p-4  ">
        <form
          action=""
          onSubmit={handleSubmit(handleChangePassword)}
          className="grid grid-cols-3 gap-4  lg:grid-cols-2 sm:grid-cols-1 pt-3"
        >
          <div className="inputBox">
            <input
              required
              id={"old"}
              type={show.oldPas ? "text" : "password"}
              className={`formControl  `}
              {...register("oldPassword")}
            />
            <label htmlFor={"old"}>
              Old Password
              <span className="text-red-600"> *</span>
            </label>

            <div
              onClick={() => {
                setShow((prev) => {
                  return { ...prev, oldPas: !prev.oldPas };
                });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {show.oldPas ? <VscEye /> : <VscEyeClosed />}
            </div>
          </div>
          <div className="inputBox">
            <input
              required
              id={"newPassword"}
              type={show.newPass ? "text" : "password"}
              className={`formControl  `}
              {...register("newPassword")}
            />
            <label htmlFor={"newPassword"}>
              New Password
              <span className="text-red-600"> *</span>
            </label>

            <div
              onClick={() => {
                setShow((prev) => {
                  return { ...prev, newPass: !prev.newPass };
                });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {show.newPass ? <VscEye /> : <VscEyeClosed />}
            </div>
          </div>
          <div className="inputBox">
            <input
              required
              id={"confirmPassword"}
              type={show.conPas ? "text" : "password"}
              className={`formControl  `}
              {...register("confirmPassword")}
            />
            <label htmlFor={"confirmPassword"}>
              Confirm Password
              <span className="text-red-600"> *</span>
            </label>

            <div
              onClick={() => {
                setShow((prev) => {
                  return { ...prev, conPas: !prev.conPas };
                });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              {show.conPas ? <VscEye /> : <VscEyeClosed />}
            </div>
          </div>

          <button className="btn btn-primary col-span-3 lg:col-span-1 w-max ms-auto">
            Save
          </button>
        </form>
      </div>
    </>
  );
}

export default ChangePassword;
