import { toast } from "react-toastify";
import { userApi } from "../../../../Service/api";

export default async function getAttendanceReport(
  payload,
  setReportData,
  setIsLoading
) {
  try {
    setIsLoading(true);
    const res = await userApi.attendanceReport(payload);
    toast.success(res.data?.message);
    setIsLoading(false);
    setReportData(res.data.data);
  } catch (error) {
    console.error("error: ", error.message);
    return null;
  }
}
