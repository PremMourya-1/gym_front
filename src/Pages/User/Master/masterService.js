import toast from "react-hot-toast";
import { USER_DETAILS } from "../../../Constant/Constant";
import { userApi } from "../../../Service/api";
import {
  addMasterData,
  deleteMasterData,
  setMasterData,
  setMasterDataAllMasterData,
  updateMasterData,
} from "../../../Store/Slices/MaserSlice";
import {
  getLocaleStorageItem,
  setLocaleStorageItem,
} from "../../../Utils/localeStorage";

async function getMasterAllData(dispatch) {
  try {
    const res = await userApi.masterAll();
    dispatch(setMasterDataAllMasterData(res.data.data));
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}
async function getMasterData(slug, dispatch) {
  try {
    const res = await userApi.master({ slug });
    dispatch(setMasterData({ type: slug, data: res.data.data }));
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}
async function addAndEditMaster(
  isEditing,
  slug,
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
      ? await userApi.editMaster({ slug, id: listId, data })
      : await userApi.addMaster({ slug, data });
    setIsLoading(false);

    if (res.data.action) {
      toast.success(res.data.message);
      if (slug === "session" && Number(res.data.data.isActive)) {
        setLocaleStorageItem(USER_DETAILS, {
          ...getLocaleStorageItem(USER_DETAILS),
          sessionData: res.data.data,
        });
        window.location.href = "/";
      }
      setDrawer(false);
      if (isEditing) {
        dispatch(
          updateMasterData({ type: slug, id: listId, data: res.data.data }),
        );
      } else
        dispatch(
          addMasterData({ type: slug, id: listId, data: res.data.data }),
        );
    } else toast.error(res.data.message);
    return res;
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}
async function deleteMaster(slug, id, setIsLoading, setModal, dispatch) {
  try {
    setIsLoading(true);
    const res = await userApi.deleteMaster({ slug, id });
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setModal(false);
      dispatch(deleteMasterData({ type: slug, id }));
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching master data:", error.message);
    return null;
  }
}

export { addAndEditMaster, deleteMaster, getMasterAllData };

export default getMasterData;
