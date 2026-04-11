import { toast } from "react-toastify";
import { userApi } from "../../../../Service/api";
import {
  addTamplate,
  deleteTamplateData,
  setTamplate,
  updateTamplate,
} from "../../../../Store/Slices/TamplateSlice";

export default async function getSmsTamplateData(dispatch) {
  try {
    const res = await userApi.smsTamplateList();
    dispatch(setTamplate(res.data.data));
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}
async function addEditTamplate(
  isEditing,
  listId,
  data,
  setIsLoading,
  setDrawer,
  dispatch
) {
  try {
    setIsLoading(true);
    let res;
    res = isEditing
      ? await userApi.editTamplate({ id: listId, data })
      : await userApi.addTamplate(data);
    setIsLoading(false);

    if (res.data.action) {
      toast.success(res.data.message);
      setDrawer(false);
      if (isEditing) {
        dispatch(updateTamplate(res.data.data));
      } else dispatch(addTamplate(res.data.data));
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
  }
}
async function deleteTamplate(id, setIsLoading, setModal, dispatch) {
  try {
    setIsLoading(true);
    const res = await userApi.deleteTamplate({ id });
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setModal(false);
      dispatch(deleteTamplateData({ id }));
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}

export { deleteTamplate, addEditTamplate };
