import toast from "react-hot-toast";
import { userApi } from "../../../Service/api";

export default async function getDeviceData(setDeviceList) {
  try {
    const res = await userApi.device();
    setDeviceList(res.data.data);
  } catch (error) {
    console.error("Error :", error.message);
    return null;
  }
}

async function addEditDevice(
  isEditing,
  listId,
  data,
  setIsLoading,
  setDrawer,
  setDeviceList,
) {
  try {
    setIsLoading(true);
    let res;
    res = isEditing
      ? await userApi.editDevice({ id: listId, data })
      : await userApi.addDevice(data);

    setIsLoading(false);

    if (res.data.action) {
      toast.success(res.data.message);
      setDrawer(false);
      if (isEditing) {
        setDeviceList((prev) => {
          return prev.map((item) => {
            if (item.id === listId) {
              return res.data.data;
            }
            return item;
          });
        });
      } else setDeviceList((prev) => [res.data.data, ...prev]);
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error :", error.message);
  }
}
async function deleteDevice(id, setIsLoading, setModal, setDeviceList) {
  try {
    setIsLoading(true);
    const res = await userApi.deleteDevice({ id });
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setModal(false);
      setDeviceList((prev) => {
        return prev.filter((it) => it.id !== id);
      });
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error :", error.message);
    return null;
  }
}

export { deleteDevice, addEditDevice };
