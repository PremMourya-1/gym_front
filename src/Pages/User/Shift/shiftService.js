import toast from "react-hot-toast";
import { userApi } from "../../../Service/api";
import {
  addShiftData,
  deleteShiftData,
  setShift,
  updateShiftData,
} from "../../../Store/Slices/Shift";

export default async function getShiftData(dispatch) {
  try {
    const res = await userApi.shift();
    dispatch(setShift(res.data.data));
  } catch (error) {
    console.error("Error", error.message);
    return null;
  }
}
async function addEditShift(
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
      ? await userApi.editShift({ id: listId, data })
      : await userApi.addShift(data);
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setDrawer(false);
      if (isEditing) {
        dispatch(updateShiftData(res.data.data));
      } else dispatch(addShiftData(res.data.data));
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error shift  data:", error.message);
  }
}
async function deleteShift(id, setIsLoading, setModal, dispatch) {
  try {
    setIsLoading(true);
    const res = await userApi.deleteShift({ id });
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setModal(false);
      dispatch(deleteShiftData({ id }));
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}

export { deleteShift, addEditShift };
