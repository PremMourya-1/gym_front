import { toast } from "react-toastify";
import { userApi } from "../../../../Service/api";

export default async function getSmsData(setSmsList) {
  try {
    const res = await userApi.sms();
    setSmsList(res.data.data);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}
async function addEditSms(data, setIsLoading, setDrawer, setSmsList) {
  try {
    setIsLoading(true);
    const res = await userApi.addEditSms(data);

    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setDrawer(false);
      setSmsList([res.data.data]);
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
  }
}

export { addEditSms };
