import { userApi } from "../../../../Service/api";

export default async function getMonthlyAttendanceData(
  payload,
  setIsLoading,
  setStudentList
) {
  try {
    setIsLoading(true);
    const res = await userApi.searchStudent(payload);
    setIsLoading(false);
    setStudentList(res.data.data);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}
