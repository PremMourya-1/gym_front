import adminApi from "../../../Service/api";

export default async function getDashboardData(setDashboardData) {
  try {
    const res = await adminApi.dashboard();
    setDashboardData(res.data.data);
  } catch (error) {
    console.error("Error dashboard:", error.message);
    return null;
  }
}
