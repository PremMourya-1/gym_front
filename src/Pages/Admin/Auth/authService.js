import { toast } from "react-toastify";
import adminApi, { userApi } from "../../../Service/api";
import {
  removeLoaleStorageItem,
  setLocaleStorageItem,
} from "../../../Utils/localeStorage";
import {
  loginToggleAction,
  logoutAction,
} from "../../../Store/Slices/AuthSlice";
import { ADMIN_DETAILS, USER_DETAILS } from "../../../Constant/Constant";

async function login(isAdmin, data, dispatch, setIsLoading, navigate) {
  try {
    setIsLoading(true);
    let res;
    if (isAdmin) {
      res = await adminApi.adminLogin(data);
    } else {
      res = await userApi.userLogin(data);
    }
    setIsLoading(false);
    if (res.data.action) {
      setLocaleStorageItem(isAdmin ? ADMIN_DETAILS : USER_DETAILS, {
        ...res.data.data,
        isAdmin,
      });
      removeLoaleStorageItem(isAdmin ? USER_DETAILS : ADMIN_DETAILS);
      toast.success(res.data.message);
      dispatch(loginToggleAction({ ...res.data.data, isAdmin }));
      navigate(isAdmin ? "/admin" : "/");
    } else toast.error(res.data.message);
  } catch (e) {
    console.log(e);
  } finally {
    setIsLoading(false);
  }
}

async function logout(isAdmin, dispatch, setIsLoading) {
  try {
    setIsLoading && setIsLoading(true);
    let res;
    if (isAdmin) {
      res = await adminApi.adminLogout();
    } else {
      res = await userApi.userLogout();
    }
    setIsLoading && setIsLoading(false);
    if (res.data.action) {
      removeLoaleStorageItem(isAdmin ? ADMIN_DETAILS : USER_DETAILS);
      dispatch(logoutAction());
      window.location.replace(isAdmin ? "/admin/login" : "/login");
      // navigate();
    } else toast.error(res.data.message);
  } catch (e) {
    console.log(e);
  }
}

async function sendOtp(isAdmin, setIsLoading, payload, setIsOtpSent) {
  try {
    setIsLoading(true);
    let res;
    if (isAdmin) {
      res = await adminApi.sendOtp(payload);
    } else {
      res = await userApi.sendOtp(payload);
    }
    setIsLoading(false);
    if (res.data.action) {
      setIsOtpSent(true);
      toast.success(res.data.message);
    } else toast.error(res.data.message);
    return res;
  } catch (e) {
    console.log(e);
  }
}
async function forgotPassword(isAdmin, payload, setIsLoading, setIsForgoting) {
  try {
    setIsLoading(true);
    let res;
    if (isAdmin) {
      res = await adminApi.adminFrogotPassword(payload);
    } else {
      res = await userApi.userFrogotPassword(payload);
    }
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setIsForgoting(false);
    } else toast.error(res.data.message);
  } catch (e) {
    console.log(e);
  }
}

export { logout, sendOtp, forgotPassword };

export default login;
