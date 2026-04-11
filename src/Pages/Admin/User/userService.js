import { toast } from "react-toastify";
import adminApi from "../../../Service/api";

export default async function getUserData(setUserList) {
  try {
    const res = await adminApi.user();
    setUserList(res.data.data);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}

async function addEditUser(
  isEditing,
  listId,
  data,
  setIsLoading,
  setDrawer,
  setUserList
) {
  try {
    setIsLoading(true);
    let res;
    res = isEditing
      ? await adminApi.editUser({ id: listId, data })
      : await adminApi.addUser(data);
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setDrawer(false);
      if (isEditing) {
        setUserList((prev) => {
          return prev.map((item) => {
            if (item.id === listId) {
              return res.data.data;
            }
            return item;
          });
        });
      } else
        setUserList((prev) => {
          return prev ? [res.data.data, ...prev] : [res.data.data];
        });
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
  }
}

async function deleteUser(id, setIsLoading, setModal, setUserList) {
  try {
    setIsLoading(true);
    const res = await adminApi.deleteUser({ id });
    setIsLoading(false);
    setModal(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setUserList((prev) => {
        return prev.filter((item) => item.id !== id);
      });
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error  data:", error.message);
    return null;
  }
}
export { addEditUser, deleteUser };
