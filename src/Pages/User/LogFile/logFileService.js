import toast from "react-hot-toast";
import { userApi } from "../../../Service/api";

export default async function getLogfileData(
  payload,
  setIsLoading,
  setLogData,
) {
  try {
    setIsLoading(true);
    const res = await userApi.log(payload);
    setIsLoading(false);
    setLogData(res.data.data);
    if (!res.data?.data?.attendences?.length) {
      toast.error("No records found");
    }
  } catch (err) {
    console.log(err);
  }
}
