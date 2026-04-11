import { toast } from "react-toastify";
import { userApi } from "../../../../../Service/api";

export default async function getDailyAttendanceData(
  payload,
  setClassData,
  setIsLoading
) {
  try {
    setIsLoading && setIsLoading(true);
    const res = await userApi.attendance(payload);
    toast.success(res.data.message);
    setIsLoading && setIsLoading(false);
    setClassData(res.data.data);
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
async function getClassStudentData(payload, studentList, setLoading) {
  try {
    setLoading(true);
    const res = await userApi.classStudent(payload);
    setLoading(false);
    studentList(res.data.data);
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
async function createAttendance(payload, setIsLoading) {
  try {
    setIsLoading(true);
    const res = await userApi.applyAttendance(payload);
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
    } else toast.error(res.data.message);
    return res;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}
async function notifyParent(payload, setIsLoading) {
  try {
    setIsLoading(true);
    const res = await userApi.notifyParent(payload);
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

export { getClassStudentData, createAttendance, notifyParent };
