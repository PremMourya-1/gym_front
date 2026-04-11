import { userApi } from "../../../Service/api";

export default async function getDashboardData( setDashboardData) {
  try {
    const res = await userApi.dashboard();
    setDashboardData(res.data.data);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}
