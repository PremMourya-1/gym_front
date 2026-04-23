import toast from "react-hot-toast";
import { userApi } from "../../../Service/api";
import {
  addHolidayData,
  deleteHolidayData,
  setHolidayData,
  updateHolidayData,
} from "../../../Store/Slices/HolidaySlice";
export default async function getHolidayData(payload, dispatch) {
  try {
    const res = await userApi.holidayList(payload);
    dispatch(setHolidayData(res.data.data));
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}
async function addAndEditHoliday(
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
      ? await userApi.editHoliday({ id: listId, data })
      : await userApi.addHoliday(data);
    setIsLoading(false);

    if (res.data.action) {
      toast.success(res.data.message);
      setDrawer(false);
      if (isEditing) {
        dispatch(updateHolidayData(res.data.data));
      } else dispatch(addHolidayData(res.data.data));
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
  }
}
async function deleteHoliday(payload, setIsLoading, setModal, dispatch) {
  try {
    setIsLoading(true);
    const res = await userApi.deleteHoliday(payload);
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setModal(false);
      dispatch(deleteHolidayData({ id: payload.id }));
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}

export { addAndEditHoliday, deleteHoliday };
