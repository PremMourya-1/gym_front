import { useEffect, useState } from "react";
import getMonthlyAttendanceData, {
  applyMonthlyAttendance,
  getMonthlyOrYearyStudentDataAttendance,
} from "./monthService";
import { useDispatch, useSelector } from "react-redux";
import { getMasterAllData } from "../../../Master/masterService";
import { useForm } from "react-hook-form";
import MonthlyTable from "./MonthlyTable";
import LoaderSpiner from "../../../../../Components/Loaders/LoaderSpiner";
import DrawerComponent from "../../../../../Components/Drawer/Drawer";
import MultiDatePickerNew from "../../../../../Components/datePicker/MultiDatePickerNew";

function MonthlyAttendance() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);
  const [studentList, setStudentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [drawer, setDrawer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [masterPayload, setMasterPayload] = useState({});
  const [monthlyStudentAttendanceData, setMonthlyStudentAttendanceData] =
    useState();
  const [studentData, setStudentData] = useState({});

  const [drawerTitle, setDrawerTitle] = useState("");
  useEffect(() => {
    const yle = document.querySelector(".drawerBody");
    yle?.click();
  }, [drawer]);

  const { register, handleSubmit } = useForm();

  const [masterData, setMasterData] = useState();
  const masterStoreData = useSelector((state) => state.master);

  useEffect(() => {
    if (
      !masterStoreData?.find((it) => it.type === "class") ||
      !masterStoreData?.find((it) => it.type === "stream") ||
      !masterStoreData?.find((it) => it.type === "section")
    ) {
      getMasterAllData(dispatch);
    } else setMasterData(masterStoreData);
  }, [masterStoreData]);

  function handleGetMonthData(data) {
    setMasterPayload({ ...data, sessionMasterId });
    getMonthlyAttendanceData(
      { ...data, sessionMasterId },
      setStudentList,
      setIsLoading
    );
  }
  function handleMonthlyStudentData(id) {
    getMonthlyOrYearyStudentDataAttendance(
      "month",
      { ...masterPayload, studentId: id },
      setLoading,
      setMonthlyStudentAttendanceData
    );
  }

  function onActionClick(row) {
    setDrawerTitle(row.student.studentName);
    setDrawer(true);
    setMonthlyStudentAttendanceData();
    handleMonthlyStudentData(row.student.id);
    setStudentData({
      admissionNo: row.student?.admissionNo,
      promotionId: row.promotionId,
    });
  }

  function handleApplyMonthlyAttendance() {
    const payload = {
      ...masterPayload,
      sessionMasterId,
      attendanceData: monthlyStudentAttendanceData,
      ...studentData,
    };
    applyMonthlyAttendance(payload, setLoading, setDrawer, setStudentList);
  }

  return (
    <>
      <div className="card mb-4 p-4 ">
        <form onSubmit={handleSubmit(handleGetMonthData)}>
          <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-8 lg:gap-5 pt-4 ">
            <div className="inputBox">
              <input
                required
                type={"month"}
                className={`formControl `}
                {...register("month")}
              />
              <label className="pr-12" htmlFor={"id"}>
                Select Month <span className="text-red-600"> *</span>
              </label>
            </div>
            <div className="inputBox">
              <select
                className="formControl"
                required
                {...register("classMasterId")}
              >
                <option value="" hidden>
                  --Class--
                </option>
                {masterData
                  ?.find((it) => it.type === "class")
                  ?.data.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              <label htmlFor={"id"}>
                Select Class <span className="text-red-600"> *</span>
              </label>
            </div>
            <div className="inputBox">
              <select
                className="formControl"
                required
                {...register("streamMasterId")}
              >
                <option value="" hidden>
                  --Stream--
                </option>
                {masterData
                  ?.find((it) => it.type === "stream")
                  ?.data.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              <label htmlFor={"id"}>
                Select Stream <span className="text-red-600"> *</span>
              </label>
            </div>
            <div className="inputBox">
              <select
                className="formControl"
                required
                {...register("sectionMasterId")}
              >
                <option value="" hidden>
                  --Section--
                </option>
                {masterData
                  ?.find((it) => it.type === "section")
                  ?.data.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
              </select>
              <label htmlFor={"id"}>
                Select Section <span className="text-red-600"> *</span>
              </label>
            </div>
          </div>

          <button disabled={isLoading} className="btn ms-auto btn-primary mt-7">
            {isLoading ? <LoaderSpiner /> : "Get"}
          </button>
        </form>
      </div>
      <MonthlyTable data={studentList} onActionClick={onActionClick} />

      <DrawerComponent
        open={drawer}
        setOpen={setDrawer}
        title={drawerTitle}
        size={"350px"}
        body={
          <>
            {monthlyStudentAttendanceData ? (
              <div className="flex flex-col justify-between h-full">
                <div>
                  <MultiDatePickerNew
                    attendance={monthlyStudentAttendanceData}
                    setAttendance={setMonthlyStudentAttendanceData}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={handleApplyMonthlyAttendance}
                    disabled={loading}
                    className=" btn btn-primary ms-auto"
                  >
                    {loading ? <LoaderSpiner /> : "Save Attendance"}
                  </button>
                </div>
              </div>
            ) : (
              <LoaderSpiner hw={30} color={true} />
            )}
          </>
        }
      />
    </>
  );
}

export default MonthlyAttendance;
