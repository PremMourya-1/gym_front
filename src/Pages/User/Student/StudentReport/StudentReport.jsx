import { useForm } from "react-hook-form";
import LoaderSpiner from "../../../../Components/Loaders/LoaderSpiner";
import { useEffect, useState } from "react";
import getMonthlyAttendanceData from "./studentReportService";
import { useSelector } from "react-redux";
import ReportTable from "./ReportTable";
import DrawerComponent from "../../../../Components/Drawer/Drawer";
import ReportYearCalender from "./ReportYearCalender";
import { getMonthlyOrYearyStudentDataAttendance } from "../StudentAttendance/MonthlyAttendance/monthService";
import BreadCrumb from "../../../../Components/Common/BreadCrumb/BreadCrumb";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { MdLocalPrintshop } from "react-icons/md";

function StudentReport() {
  const { query } = useParams();
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);

  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, setValue } = useForm();
  const [studentList, setStudentList] = useState([]);
  const [drawer, setDrawer] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({}); //
  const [yearlyStudentAttendanceData, setYearlyStudentAttendanceData] =
    useState();

  useEffect(() => {
    if (query) {
      setValue("search", query);
      getMonthlyAttendanceData(
        { search: query, sessionMasterId },
        setIsLoading,
        setStudentList
      );
    } else {
      setStudentList([]);
    }
  }, [query]);

  function handleGetStudentData(data) {
    const payload = { ...data };
    !data.admissionNo && delete payload.admissionNo;
    !data.deviceId && delete payload.deviceId;
    getMonthlyAttendanceData(
      { ...payload, sessionMasterId },
      setIsLoading,
      setStudentList
    );
  }
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loading && setYearlyStudentAttendanceData();
  }, [loading]);
  function handleMonthOrYarlyStudentAttendanceData(payload) {
    getMonthlyOrYearyStudentDataAttendance(
      "year", // type should be 'month' or 'year
      payload,
      setLoading,
      setYearlyStudentAttendanceData
    );
  }
  function onActionClick(row) {
    console.log(row);
    setSelectedStudent(row);
    const payload = {
      classMasterId: row.class_master.id,
      sectionMasterId: row.section_master.id,
      streamMasterId: row.stream_master.id,
      studentId: row.student_master.id,
      sessionMasterId,
    };
    handleMonthOrYarlyStudentAttendanceData(payload);
    setDrawer(true);
  }
  const rightArror = (
    <svg
      width={16}
      height={16}
      className={"stroke-gray-600 dark:stroke-gray-400"}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 12L31 24L19 36"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  return (
    <>
      <div className="breadCrumbAndSearchBar">
        {query ? (
          <div className="shrink-0">
            <h1 className="text-2xl font-semibold capitalize mb-1">
              Student Report
            </h1>
            <ul className="flex gap-1 capitalize font-medium items-center">
              <li>
                <Link
                  className={`text-sm  flex gap-1  text-gray-700 dark:text-gray-300`}
                  to={"/"}
                >
                  Home
                </Link>
              </li>
              <li>
                <span className={`text-sm  flex items-center gap-1  `}>
                  {rightArror} Attendance
                </span>
              </li>
              <li>
                <span
                  className={`text-sm  flex items-center gap-1  text-[color:var(--background)] font-semibold  dark:text-[color:var(--dark-primary-dark)]`}
                >
                  {rightArror} Student report
                </span>
              </li>
            </ul>
          </div>
        ) : (
          <BreadCrumb />
        )}
        <div className="searchAndButton">
          <form
            className="searchContainer flex gap-6"
            onSubmit={handleSubmit(handleGetStudentData)}
          >
            <div className="inputBox w-full">
              <input
                required
                type={"text"}
                className={`formControl`}
                {...register("search")}
              />
              <label className="pr-12" htmlFor={"id"}>
                Student Name <span className="text-red-600"> *</span>
              </label>
            </div>

            <button disabled={isLoading} className="btn ms-auto btn-primary">
              {isLoading ? <LoaderSpiner /> : "Get"}
            </button>
          </form>
        </div>
      </div>
      <ReportTable data={studentList} onActionClick={onActionClick} />
      <DrawerComponent
        open={drawer}
        setOpen={setDrawer}
        title={
          <div>
            <p>{selectedStudent?.student_master?.studentName}</p>
            <p className="text-sm">{`${selectedStudent.class_master?.name} ${selectedStudent.stream_master?.name} ${selectedStudent.section_master?.name}`}</p>
          </div>
        }
        size={"1020px"}
        body={
          <>
            <div id="attendancePrint">
              <div className="flex justify-between mb-4">
                <div className="studentDetails showOnPrint">
                  <p>{selectedStudent?.student_master?.studentName}</p>
                  <p className="text-sm">{`${selectedStudent.class_master?.name} ${selectedStudent.stream_master?.name} ${selectedStudent.section_master?.name}`}</p>
                </div>
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="btn btn-primary  ms-auto hideOnPrint"
                >
                  <MdLocalPrintshop className="text-base" />
                  Print
                </button>
              </div>
              <div className="pb-6 yearly">
                {yearlyStudentAttendanceData ? (
                  <ReportYearCalender
                    yearlyStudentAttendanceData={yearlyStudentAttendanceData}
                  />
                ) : (
                  <LoaderSpiner hw={30} color={true} />
                )}
              </div>
            </div>
          </>
        }
      />
    </>
  );
}

export default StudentReport;
