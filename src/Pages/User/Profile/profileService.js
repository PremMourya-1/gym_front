import { toast } from "react-toastify";
import { USER_DETAILS } from "../../../Constant/Constant";
import { userApi } from "../../../Service/api";
import {
  getLocaleStorageItem,
  setLocaleStorageItem,
} from "../../../Utils/localeStorage";
import { updateUserData } from "../../../Store/Slices/AuthSlice";

export default async function updateProfile(data, setLogo, dispatch) {
  const formData = new FormData();
  formData.append("logo", data);
  try {
    const res = await userApi.updateProfile(formData);
    if (res.data.action) {
      toast.success(res.data.message);
      const userData = getLocaleStorageItem(USER_DETAILS);
      const updated = {
        ...userData,
        user: { ...userData.user, logo: res.data.data },
      };
      setLocaleStorageItem(USER_DETAILS, updated);
      dispatch(updateUserData({ logo: res.data.data }));
      setLogo(res.data.data);
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
