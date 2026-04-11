import { toast } from "react-toastify";
import { userApi } from "../../../Service/api";

export default async function studentPromotionList(
  payload,
  setStudentList,
  setIsLoading,
  setStep
) {
  try {
    setIsLoading(true);
    let res = await userApi.studentPromotionList(payload);
    setIsLoading(false);
    const updated = res.data.data.map((item) => {
      return { ...item, studentName: item.student_master.studentName };
    });
    setStudentList(updated);
    setStep(1);
  } catch (error) {
    console.error("Error  :", error.message);
    return null;
  }
}
async function promoteStudent(
  payload,
  setLoading,
  setStep,
  reset,
  reset2,
  setModal
) {
  try {
    setLoading(true);
    let res = await userApi.promoteStudent(payload);
    setLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setStep(0);
      reset();
      reset2();
      setModal(false);
    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.error("Error  :", error.message);
    return null;
  }
}
export { promoteStudent };
