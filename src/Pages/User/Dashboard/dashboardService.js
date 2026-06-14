import { userApi } from "../../../Service/api";

export default async function getDashboardData(setDashboardData) {
  try {
    const res = await userApi.dashboard();
    const dashboardData = res.data.data;
    setDashboardData(dashboardData);
    return dashboardData;
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}
