import adminApi from "../../../Service/api";
import { setNotification } from "../../../Store/Slices/NotificationSlice";

export default async function getNotification(dispatch) {
  try {
    const res = await adminApi.notification();
    dispatch(setNotification(res.data.data));
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    return null;
  }
}
