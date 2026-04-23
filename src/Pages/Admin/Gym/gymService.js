import toast from "react-hot-toast";
import adminApi from "../../../Service/api";

async function getGymData(setGymList) {
  try {
    const res = await adminApi.gym();
    setGymList(res.data.data);
  } catch (e) {
    console.log(e);
  }
}

async function createAndGym(data, id, setDrawer, setGymList, setIsLoading) {
  try {
    setIsLoading(true);
    let res;

    res = id
      ? await adminApi.editGym({ id, data })
      : await adminApi.createGym(data);

    setIsLoading(false);

    if (res.data.action) {
      setDrawer(false);
      toast.success(res.data.message);

      if (id) {
        setGymList((prev) => {
          return prev && prev.map((x) => (x.id === id ? res.data.data : x));
        });
      } else {
        setGymList((prev) => {
          return prev ? [res.data.data, ...prev] : [res.data.data];
        });
      }
    } else toast.error(res.data.message);
  } catch (e) {
    console.log(e);
  }
}

async function deleteGym(id, setIsLoading, setGymList, setModal) {
  try {
    setIsLoading(true);
    const res = await adminApi.deleteGym({ id });
    setIsLoading(false);

    if (res.data.action) {
      setModal(false);
      toast.success(res.data.message);

      setGymList((prev) => {
        return prev && prev.filter((x) => x.id !== id);
      });
    } else toast.error(res.data.message);
  } catch (e) {
    console.log(e);
  }
}

export { getGymData, deleteGym };

export default createAndGym;
