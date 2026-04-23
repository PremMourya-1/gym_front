import { useEffect, useState } from "react";
import StudentListTable from "./StudentListTable";
import { getDeActiveStudentData, getOldStudentData } from "./studentService";
import BreadCrumb from "../../../../Components/Common/BreadCrumb/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../../../../Components/Modal/ConfirmModal";
import { userApi } from "../../../../Service/api";
import CustomModal from "../../../../Components/Modal/Modal";
import getStudentLimit from "../../Plan/planService";
import toast from "react-hot-toast";
import Pagination from "../../../../Components/Pagination/Pagination";

function DeActiveStudentList() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);
  const [isLoading, setIsLoading] = useState(false);

  const [studentData, setStudentData] = useState();
  const [filterData, setFilterData] = useState({
    limit: 10,
    page: 1,
  });

  useEffect(() => {
    getDeActiveStudentData({ sessionMasterId, ...filterData }, setStudentData);
  }, []);

  const [deactiveModal, setDeactiveModal] = useState(false);

  const [status, setStatus] = useState({});
  const [listId, setListId] = useState();

  const [planStudentCount, setPlanStudentCount] = useState(1);
  const [existingStudentsInDb, setExistingStudentData] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      const res = await getOldStudentData({ sessionMasterId }, dispatch);
      setExistingStudentData(
        res.data.data?.filter((it) => it.status === 1)?.length,
      );
    })();
  }, [studentData]);

  useEffect(() => {
    getStudentLimit(setPlanStudentCount);
  }, []);

  async function onChangeStatus(isActive, id) {
    if (planStudentCount <= existingStudentsInDb) {
      toast.error("You can't deactivate this student. Student limit reached.");
      return;
    } else {
      setListId(id);
      setDeactiveModal(true);
      setStatus({ isActive: Number(isActive), id });
    }
  }
  async function handleActive() {
    setIsLoading(true);

    const formData = new FormData();
    Object.keys(status).forEach((item) => {
      formData.append(item, status[item]);
    });

    const res = await userApi.editStudent({ id: listId, data: formData });
    if (res.data.action) {
      setStudentData((prev) => {
        return {
          ...prev,
          data: prev.data.filter((it) => it.id !== res.data.data.id),
        };
      });
    }

    setIsLoading(false);
    setDeactiveModal(false);
  }

  return (
    <>
      <div className="breadCrumbAndSearchBar">
        <BreadCrumb />
      </div>
      <div className="card overflow-hidden rounded-lg p-3 mt-1 md:mt-2.5">
        <StudentListTable
          data={studentData?.data}
          isEditing={false}
          onChangeStatus={onChangeStatus}
        />
        <div className="flex justify-between items-center mt-5">
          <div className="inputBox">
            <select
              className="formControl min-w-36  px-2"
              required
              onChange={(e) => {
                setFilterData((prev) => {
                  return { ...prev, limit: Number(e.target.value) };
                });
              }}
            >
              <option value={10} selected>
                10 Per Page
              </option>
              <option value={20}>20 Per Page</option>
              <option value={50}>50 Per Page</option>
              <option value={100}>100 Per Page</option>
            </select>
          </div>

          <Pagination
            filterData={filterData}
            setFilterData={setFilterData}
            totalDataInDb={studentData?.studentCount}
          />
        </div>
      </div>
      <CustomModal
        isHeader={false}
        open={deactiveModal}
        setOpen={setDeactiveModal}
        onConfirm={handleActive}
        loading={isLoading}
        body={
          <>
            <ConfirmModal
              message={"Are Your sure , You want to active student "}
            />
          </>
        }
      />
    </>
  );
}

export default DeActiveStudentList;
