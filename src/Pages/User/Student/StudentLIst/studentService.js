import { toast } from "react-toastify";
import { userApi } from "../../../../Service/api";
import { setExistingStudentData } from "../../../../Store/Slices/ExistingStudent";
import {
  setStudentData,
  addStudentData,
  deleteStudentData,
  updateStudentData,
  AddBulkStudents,
} from "../../../../Store/Slices/StudentSlice";

async function getStudentData(data, dispatch, setIsLoading, setSearchDrawer) {
  try {
    setIsLoading && setIsLoading(true);
    const res = await userApi.studentList(data);
    setSearchDrawer && setSearchDrawer(false);

    dispatch(setStudentData(res.data.data));
    setIsLoading && setIsLoading(false);
  } catch (error) {
    console.error("Error fetching student data:", error.message);
    return null;
  }
}
async function getDeActiveStudentData(data, setStudentList) {
  try {
    const res = await userApi.deActiveStudentList(data);
    setStudentList(res.data.data);
  } catch (error) {
    console.error("Error fetching student data:", error.message);
    return null;
  }
}
async function getOldStudentData(data, dispatch) {
  try {
    const res = await userApi.allStudentAdmisison(data);
    dispatch(setExistingStudentData(res.data.data));
    return res;
  } catch (error) {
    console.error("Error fetching student data:", error.message);
    return null;
  }
}
async function addAndEditStudent({
  payload,
  setIsLoading,
  isEditing,
  listId,
  setOpen, //drawer
  dispatch,
  reset,
  navigate,
}) {
  try {
    const formData = new FormData();
    Object.keys(payload).forEach((item) => {
      formData.append(item, payload[item]);
    });
    setIsLoading(true);
    let res;
    res = isEditing
      ? await userApi.editStudent({ id: listId, data: formData })
      : await userApi.createStudent(formData);

    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setOpen(false);
      reset();
      if (isEditing) {
        dispatch(updateStudentData({ id: listId, data: res.data.data }));
      } else dispatch(addStudentData(res.data.data));
      navigate("/student/student-list");
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching student data:", error.message);
    return null;
  }
}
async function deleteStudent(id, setIsLoading, setModal, dispatch) {
  try {
    setIsLoading(true);
    const res = await userApi.deleteStudent({ id });
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setModal(false);
      dispatch(deleteStudentData({ id }));
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching student data:", error.message);
    return null;
  }
}
async function bulkAdmission(
  payload,
  dispatch,
  setIsLoading,
  setBulkStudentListDrawer
) {
  try {
    setIsLoading(true);
    const res = await userApi.studentBulkAdmission(payload);
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      dispatch(AddBulkStudents(res.data.data));
      setBulkStudentListDrawer(false);
    } else toast.error(res.data.message);
  } catch (error) {
    console.error("Error fetching student data:", error.message);
    return null;
  }
}

export {
  addAndEditStudent,
  deleteStudent,
  getOldStudentData,
  bulkAdmission,
  getDeActiveStudentData,
};

export default getStudentData;
