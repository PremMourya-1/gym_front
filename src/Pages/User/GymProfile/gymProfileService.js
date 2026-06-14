import { userApi } from "../../../Service/api";

export default async function getGymProfile(setData) {
  try {
    const res = await userApi.profile();
    setData(res.data.data);
  } catch (error) {
    console.error("Error fetching gym profile data data:", error.message);
    return null;
  }
}
