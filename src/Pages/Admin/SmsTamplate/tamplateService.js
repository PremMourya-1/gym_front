import toast from "react-hot-toast";
import {
  addTamplate,
  deleteTamplateData,
  setTamplate,
  updateTamplate,
} from "../../../Store/Slices/TamplateSlice";
import adminApi from "../../../Service/api";

export default async function getSmsTamplateData(dispatch) {
  try {
    const res = await adminApi.smsTamplateList();
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
  dispatch,
) {
  try {
    setIsLoading(true);
    let res;
    res = isEditing
      ? await adminApi.editTamplate({ id: listId, data })
      : await adminApi.addTamplate(data);
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
    const res = await adminApi.deleteTamplate({ id });
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
