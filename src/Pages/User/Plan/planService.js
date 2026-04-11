import { toast } from "react-toastify";
import { userApi } from "../../../Service/api";

async function getPlans(setPlanList) {
  try {
    const res = await userApi.plan();
    setPlanList(res.data.data);
  } catch (e) {
    console.log(e);
  }
}
async function createAndPlan(data, id, setDrawer, setPlanList, setIsLoading) {
  try {
    setIsLoading(true);
    let res;
    res = id
      ? await userApi.editPlan({ id, data })
      : await userApi.createPlan(data);
    setIsLoading(false);

    if (res.data.action) {
      setDrawer(false);
      toast.success(res.data.message);

      if (id) {
        setPlanList((prev) => {
          return prev && prev.map((x) => (x.id === id ? res.data.data : x));
        });
      } else {
        setPlanList((prev) => {
          return prev ? [res.data.data, ...prev] : [res.data.data];
        });
      }
    } else toast.error(res.data.message);
  } catch (e) {
    console.log(e);
  }
}
async function deletePlan(id, setIsLoading, setPlanList, setModal) {
  try {
    setIsLoading(true);
    const res = await userApi.deletePlan({ id });
    setIsLoading(false);
    if (res.data.action) {
      setModal(false);
      toast.success(res.data.message);
      setPlanList((prev) => {
        return prev && prev.filter((x) => x.id !== id);
      });
    } else toast.error(res.data.message);
  } catch (e) {
    console.log(e);
  }
}
export { getPlans, deletePlan };

export default createAndPlan;
