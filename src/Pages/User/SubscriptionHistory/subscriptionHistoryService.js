import { userApi } from "../../../Service/api";

export default async function subscriptionHistory(setData) {
  try {
    const res = await userApi.subscriptionHistory();
    setData?.(res.data.data);
  } catch (error) {
    console.log(error);
    return null;
  }
}
