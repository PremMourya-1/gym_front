import { toast } from "react-toastify";
import adminApi from "../../../Service/api";

export default async function getRoleData(setRoleList) {
  try {
    const res = await adminApi.role();
    setRoleList(res.data.data);
  } catch (error) {
    console.error("Error :", error.message);
    return null;
  }
}

async function addEditRole(
  isEditing,
  listId,
  data,
  setIsLoading,
  setDrawer,
  setRoleList
) {
  try {
    setIsLoading(true);
    let res;
    res = isEditing
      ? await adminApi.editRole({ id: listId, data })
      : await adminApi.addRole(data);
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setDrawer(false);
      if (isEditing) {
        setRoleList((prev) => {
          return prev.map((item) => {
            if (item.id === listId) {
              return res.data.data;
            }
            return item;
          });
        });
      } else
        setRoleList((prev) => {
          return prev ? [...prev, res.data.data] : [res.data.data];
        });
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error :", error.message);
  }
}

async function deleteRole(id, setIsLoading, setModal, setRoleList) {
  try {
    setIsLoading(true);
    const res = await adminApi.deleteRole({ id });
    setIsLoading(false);
    if (res.data.action) {
      setModal(false);
      toast.success(res.data.message);
      setRoleList((prev) => {
        return prev.filter((item) => item.id !== id);
      });
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error :", error.message);
    return null;
  }
}
export { addEditRole, deleteRole };
