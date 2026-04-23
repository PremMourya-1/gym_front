import toast from "react-hot-toast";
import { userApi } from "../../../../../Service/api";

export default async function getMonthlyAttendanceData(
  payload,
  setStudentList,
  setIsLoading,
) {
  try {
    setIsLoading(true);
    const res = await userApi.monthAttendance(payload);
    setIsLoading(false);
    setStudentList(res.data.data);
  } catch (error) {
    console.error("Error ", error.message);
    return null;
  }
}
async function getMonthlyOrYearyStudentDataAttendance(
  type, // type should be year or month
  payload,
  setIsLoading,
  setData, //it can be montyly or yeary depending on the type,
) {
  try {
    setIsLoading(true);
    let res;
    if (type === "month") {
      res = await userApi.monthStudentAttendance(payload);
    } else {
      res = await userApi.yearlyStudentAttendance(payload);
    }
    setData(res.data.data);
    setIsLoading(false);
  } catch (error) {
    console.error("Error ", error.message);
    return null;
  }
}
async function getAttendanceTableData(
  payload,
  setIsLoading,
  setData, //it can be montyly or yeary depending on the type,
) {
  try {
    setIsLoading(true);
    const res = await userApi.attendanceReportTable({ ...payload });
    setData(res.data.data);
    setIsLoading(false);
  } catch (error) {
    console.error("Error ", error.message);
    return null;
  }
}
async function applyMonthlyAttendance(
  payload,
  setIsLoading,
  setDrawer,
  setStudentList,
) {
  try {
    setIsLoading(true);
    const res = await userApi.applyMonthlyAttendance(payload);
    setIsLoading(false);
    if (res.data.action) {
      setDrawer(false);
      toast.success(res.data.message);
      setStudentList((prev) => {
        return prev.map((it) =>
          it.promotionId === res.data.data.promotionId ? res.data.data : it,
        );
      });
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error ", error.message);
    return null;
  }
}

export {
  getMonthlyOrYearyStudentDataAttendance,
  applyMonthlyAttendance,
  getAttendanceTableData,
};
