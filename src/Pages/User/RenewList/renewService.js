import { toast } from "react-toastify";
import { userApi } from "../../../Service/api";

export default async function renewPlan(
  data,
  setDrawer,
  setClientList,
  setIsLoading,
  setReload,
) {
  try {
    setIsLoading(true);
    const res = await userApi.renewPlan(data);
    setIsLoading(false);

    if (res.data.action) {
      setReload((prev) => prev + 1);
      setDrawer(false);
      toast.success(res.data.message);

      // 🔥 updated client replace (assuming API updated client return kare)
      setClientList?.((prev) =>
        prev
          ? prev.map((x) => (x.id === data.clientId ? res.data.data : x))
          : prev,
      );
    } else {
      toast.error(res.data.message);
    }
  } catch (e) {
    console.log(e);
  } finally {
    setIsLoading(false);
  }
}
export async function getRenewals(data, setData) {
  try {
    const res = await userApi.renewalList(data);
    setData(res.data.data);
  } catch (e) {
    console.log(e);
  }
}
