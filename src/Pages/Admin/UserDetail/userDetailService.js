import adminApi from "../../../Service/api";

export default async function getUserPlanDetails(id, setPlanDetails, navigate) {
  try {
    const res = await adminApi.schoolPlanDetails({ id });
    if (res.data.action) {
      setPlanDetails(res.data.data);
    } else navigate("/not-found");
  } catch (error) {
    console.error("Error plan data:", error.message);
    return null;
  }
}
