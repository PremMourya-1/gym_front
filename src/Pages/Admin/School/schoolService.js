import { toast } from "react-toastify";
import adminApi from "../../../Service/api";

async function createSchool(
  formData,
  setIsLoading,
  setSchoolList,
  setDrawer,
  reset
) {
  try {
    setIsLoading(true);
    const res = await adminApi.createSchool(formData);

    setIsLoading(false);
    if (res.data.action) {
      setSchoolList((prev) => {
        return [res.data.data, ...prev];
      });
      toast.success(res.data.message);
      setDrawer(false);
      reset();
    } else toast.error(res.data.message);
  } catch (error) {
    console.log(error);
  }
}
async function getSchoolList(setSchoolList) {
  try {
    const res = await adminApi.schoolList();
    setSchoolList(res.data.data);
  } catch (error) {
    console.log(error);
  }
}
async function deleteSchool(id, setModal, schoolList, setSchoolList) {
  try {
    const res = await adminApi.deleteSchool({ id });
    if (res.data.action) {
      toast.success(res.data.message);
      setModal(false);
      const filtered = schoolList.filter((it) => it.id !== id);
      setSchoolList(filtered);
    } else toast.error(res.data.message);
  } catch (error) {
    console.log(error);
  }
}
async function editSchool(
  id,
  data,
  setDrawer,
  setSchoolList,
  setIsLoading,
  reset
) {
  try {
    setIsLoading(true);
    const res = await adminApi.editSchool({ id, data });
    setIsLoading(false);
    if (res.data.action) {
      toast.success(res.data.message);
      setDrawer(false);
      reset();
      setSchoolList((prev) => {
        return prev.map((item) => {
          if (item.id === id) {
            return res.data.data;
          } else return item;
        });
      });
    } else toast.error(res.data.message);
  } catch (error) {
    console.log(error);
  }
}
export { getSchoolList, deleteSchool, editSchool };
export default createSchool;
