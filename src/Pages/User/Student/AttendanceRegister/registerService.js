import { userApi } from "../../../../Service/api";

export default async function getRegisterData(
  payload,
  setIsLoading,
  setRegisterData
) {
  try {
    setIsLoading(true);
    const res = await userApi.register(payload);
    setIsLoading(false);
    const presetData = res.data.data;

    const updatedStudent = presetData.students.map((item) => {
      return {
        ...item,
        attendance: item.attendance.map((it) => {
          return (
            (it === 1 && "P") ||
            (it === 2 && " ") ||
            (it === 0 && "A") ||
            (it === 4 && "H") ||
            (it === 3 && "S")
          );
        }),
      };
    });
    const updated = {
      dates: presetData.dates,
      students: updatedStudent,
    };
    setRegisterData(updated);
  } catch (error) {
    console.error("Error", error.message);
    return null;
  }
}
