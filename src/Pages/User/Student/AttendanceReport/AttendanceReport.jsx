import { IoMdPrint } from "react-icons/io";
import { LuDownload } from "react-icons/lu";
import AttendanceTable from "./AttendanceTable";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterAllData } from "../../Master/masterService";
import { useForm } from "react-hook-form";
import downloadXl from "../../../../Utils/downloadXl";
import { Link } from "react-router-dom";
import getAttendanceReport from "./reportService";
import LoaderSpiner from "../../../../Components/Loaders/LoaderSpiner";
import {
  getLocaleStorageItem,
  setLocaleStorageItem,
} from "../../../../Utils/localeStorage";
import { PRINT_ATTENDANCE_REPORT } from "../../../../Constant/Constant";
import ReportMonthCalender from "./ReportMonthCalender";
import DrawerComponent from "../../../../Components/Drawer/Drawer";
import {
  getAttendanceTableData,
  getMonthlyOrYearyStudentDataAttendance,
} from "../StudentAttendance/MonthlyAttendance/monthService";
import BreadCrumb from "../../../../Components/Common/BreadCrumb/BreadCrumb";
import moment from "moment";
import { notifyParent } from "../StudentAttendance/DailyAttendance/dailyAttendanceService";
import ReportYearCalender from "../StudentReport/ReportYearCalender";
// import { MdLocalPrintshop } from "react-icons/md";

function AttendanceReport() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);

  const [masterData, setMasterData] = useState();
  const masterStoreData = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [type, setType] = useState("");
  const [drawerType, setDrawerType] = useState(""); // calender or table

  const [drawer, setDrawer] = useState(false);
  const [yearlyStudentAttendanceData, setYearlyStudentAttendanceData] =
    useState();
  const [yearCalenderDrawer, setYearCalenderDrawer] = useState(false);

  const [reportData, setReportData] = useState({ studentData: [] });

  const [isLoading, setIsLoading] = useState(false); // for getting complite student data

  useEffect(() => {
    isLoading && setReportData({ studentData: null });
  }, [isLoading]);

  const { register, handleSubmit, setValue } = useForm();
  useEffect(() => {
    if (
      !masterStoreData?.find((it) => it.type === "class") ||
      !masterStoreData?.find((it) => it.type === "stream") ||
      !masterStoreData?.find((it) => it.type === "section")
    ) {
      getMasterAllData(dispatch);
    } else setMasterData(masterStoreData);
  }, [masterStoreData]);

  const [selectedCheckValuesId, setSelectedCheckValuesId] = useState();
  const [checkedValues, setCheckedValues] = useState({});
  useEffect(() => {
    const arr = [];
    Object.keys(checkedValues)?.length &&
      Object.keys(checkedValues)?.forEach((item) => {
        if (checkedValues[item]) {
          arr.push(Number(item));
        }
      });
    setSelectedCheckValuesId(arr);
  }, [checkedValues]);

  const [allChecked, setAllChecked] = useState();

  useEffect(() => {
    setAllChecked(true);
    let trueObj = {};
    reportData?.studentData?.forEach((item) => {
      trueObj[item.promotionId] = true;
    });
    setCheckedValues(trueObj);
  }, [reportData]);
  useEffect(() => {
    if (
      Object.values(checkedValues)?.length ===
        reportData?.studentData?.length &&
      Object.values(checkedValues)?.every((item) => item === true)
    ) {
      setAllChecked(true);
    } else {
      setAllChecked(false);
    }
  }, [checkedValues]);
  function handleChange(e) {
    const value = e.target.checked;
    const id = e.target.id;

    if (id === "all") {
      if (value) {
        setAllChecked(true);
        let trueObj = {};
        reportData?.studentData?.forEach((item) => {
          trueObj[item?.promotionId] = true;
        });

        setCheckedValues(trueObj);
      } else {
        let falseObj = {};
        reportData?.studentData?.forEach((item) => {
          falseObj[item?.promotionId] = false;
        });
        setCheckedValues(falseObj);
        setAllChecked(false);
      }
    } else {
      setCheckedValues({ ...checkedValues, [id]: value });
    }
  }

  const columns = [
    // {
    //   width: "80px",
    //   title: () => {
    //     return (
    //       <>
    //         <input
    //           id="all"
    //           type="checkbox"
    //           className="form-check-input h-4 w-4 accent-[color:var(--primary-dark)] "
    //           onChange={handleChange}
    //           checked={allChecked}
    //           disabled={!data.length}
    //         />
    //       </>
    //     );
    //   },
    //   selector: (row) => {
    //     return (
    //       <>
    //         <input
    //           type="checkbox"
    //           className="form-check-input h-4 w-4 accent-[color:var(--primary-dark)] "
    //           id={row.student_master.id}
    //           onChange={handleChange}
    //           checked={checkedValues[row.student_master.id]}
    //         />
    //       </>
    //     );
    //   },
    // },
    {
      name: "Adm No",
      selector: (row) => {
        return row.student?.admissionNo;
      },
    },
    {
      name: "Device Id",
      selector: (row) => {
        return row.student?.deviceId;
      },
    },
    {
      name: "Student Name",
      selector: (row) => {
        return row.student.studentName;
      },
    },
    {
      name: "Father Name",
      selector: (row) => {
        return row.student.fathersName;
      },
    },

    {
      name: "Total Days",
      selector: (row) => {
        return row.totalDay;
      },
    },
    {
      name: "Holiday",
      selector: (row) => {
        return row.holidays;
      },
    },
    {
      name: "Total Present",
      selector: (row) => {
        return row.totalPresent;
      },
    },
    {
      name: "Total Absent",
      selector: (row) => {
        return row.totalAbsent;
      },
    },
  ];
  const dateColumn = [
    {
      name: "Adm No",
      selector: (row) => {
        return row.admissionNo;
      },
    },
    {
      name: "Device Id",
      selector: (row) => {
        return row.deviceId;
      },
    },
    {
      name: "Student Name",
      selector: (row) => {
        return row.studentName;
      },
    },
    {
      name: "Father Name",
      selector: (row) => {
        return row.fathersName;
      },
    },

    {
      name: "Attendance",
      selector: (row) => {
        return (
          (row.isPresent === 0 && "Absent") ||
          (row.isPresent === 1 && "Present")
        );
      },
    },
  ];

  // const
  // const [MasterData, setMasterData] = useState({});
  const [getReportPayload, setGetReportPayload] = useState();
  function handleGetReport(data) {
    const payload = { type, data: { ...data, sessionMasterId } };
    setGetReportPayload(payload);

    type !== "date" && delete payload.data.date;
    type !== "month" && delete payload.data.month;
    type !== "year" && delete payload.data.year;
    setLocaleStorageItem(PRINT_ATTENDANCE_REPORT, payload);

    getAttendanceReport(payload, setReportData, setIsLoading);
  }
  const [selectedStudent, setSelectedStudent] = useState({});

  const [monthlyStudentAttendanceData, setMonthlyStudentAttendanceData] =
    useState();
  const [reportTableData, setReportTableData] = useState();

  const [loading, setLoading] = useState(false); // for getting single student montyly data for drawer

  useEffect(() => {
    loading && setMonthlyStudentAttendanceData();
  }, [loading]);
  function getCompliteYearCalenderData(payload) {
    getMonthlyOrYearyStudentDataAttendance(
      "year", // type should be 'month' or 'year
      payload,
      setLoading,
      setYearlyStudentAttendanceData
    );
  }
  // calender formate k data k liye
  function handleMonthlyStudentData(studentId) {
    const masterData = getLocaleStorageItem(PRINT_ATTENDANCE_REPORT)?.data;
    getMonthlyOrYearyStudentDataAttendance(
      "month", // type should be 'month' or 'year
      { ...masterData, studentId },
      setLoading,
      setMonthlyStudentAttendanceData
    );
  }
  // table formate m data k liye
  function handleMonthlyStudentTableData(studentId) {
    const masterData = getLocaleStorageItem(PRINT_ATTENDANCE_REPORT)?.data;

    getAttendanceTableData(
      { sessionMasterId, studentId, date: masterData.month },
      setLoading,
      setReportTableData
    );
  }

  function onViewClick(row, drawerT) {
    setDrawerType(drawerT);
    setSelectedStudent(row);
    if (type === "year") {
      if (drawerT === "calender") {
        const payload = {
          ...getReportPayload,
          sessionMasterId,
          studentId: row?.student?.id,
        };
        getCompliteYearCalenderData(payload);
        setYearCalenderDrawer(true);
      } else {
        handleMonthlyStudentTableData(row.student?.id);
      }
    } else {
      setDrawer(true);
      if (drawerT === "calender") {
        handleMonthlyStudentData(row.student?.id);
      } else {
        handleMonthlyStudentTableData(row.student?.id);
      }
    }
  }

  useEffect(() => {
    setValue("date", moment(new Date()).format("YYYY-MM-DD"));
  }, [type]);

  //
  const [notifyLoading, setNotifyLoading] = useState(false);
  function sendPresentMessage() {
    const data = {
      ...getReportPayload.data,
      studentData: selectedCheckValuesId,
    };
    //
    notifyParent(data, setNotifyLoading);
  }

  return (
    <>
      <div className="breadCrumbAndSearchBar">
        <BreadCrumb />
        <div className="flex items-center gap-3 ">
          <Link
            state={reportData}
            target="_blank"
            to={`/attendance/attendance-report/print/${
              type === "date" ? "day" : type
            }-report`}
            className={`btn-print ${
              reportData?.studentData?.length
                ? ""
                : " opacity-50 pointer-events-none"
            }`}
          >
            <IoMdPrint />
            Print
          </Link>
          <button
            disabled={!reportData?.studentData?.length}
            onClick={() => {
              downloadXl(
                reportData.type === "date" ? dateColumn : columns,
                reportData?.studentData,
                "attendance_report.xlsx"
              );
            }}
            className={`btn-excel ${
              reportData?.studentData?.length
                ? ""
                : "opacity-50 pointer-events-none"
            }  shrink-0`}
          >
            <LuDownload />
            Download Excel
          </button>
        </div>
      </div>
      <div className="card p-4 mb-4 mt-1 md:mt-2.5">
        <form onSubmit={handleSubmit(handleGetReport)}>
          <div className="grid grid-cols-5 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-2 gap-8 lg:gap-5 pt-3">
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
            <div className="inputBox">
              <select
                className="formControl"
                id="country"
                name="country"
                required
                onChange={(e) => {
                  setType(e.target.value);
                }}
              >
                <option value="" hidden>
                  --Type--
                </option>
                <option value="date">Day Wise</option>
                <option value="month">Month Wise</option>
                <option value="year">This Year</option>
              </select>
              <label htmlFor="">
                Select Type <span className="text-red-600"> *</span>
              </label>
            </div>
            {type === "date" && (
              <div className="inputBox">
                <input
                  required
                  type={"date"}
                  className={`formControl `}
                  {...register("date")}
                />
                <label className="pr-12" htmlFor={"id"}>
                  Day <span className="text-red-600"> *</span>
                </label>
              </div>
            )}
            {type === "month" && (
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
            )}
          </div>

          <button disabled={isLoading} className="btn ms-auto btn-primary mt-4">
            {isLoading ? <LoaderSpiner /> : "Get"}
          </button>
        </form>
      </div>

      <div className="card rounded-lg p-4">
        <div className="flex justify-between  mb-4 ">
          {reportData.type === "date" && reportData.studentData?.length > 0 && (
            <button
              onClick={() => {
                sendPresentMessage();
              }}
              disabled={!selectedCheckValuesId?.length}
              className={`${
                !selectedCheckValuesId?.length
                  ? "opacity-50 pointer-events-none"
                  : ""
              } btn btn-primary`}
            >
              {notifyLoading ? <LoaderSpiner /> : "Send Message"}
            </button>
          )}
          {reportData?.type === "date" && (
            <div className="flex items-center justify-end gap-4">
              <span className="font-semibold">
                Total Student : {reportData.totalStudents}
              </span>
              <span className="font-semibold text-[color:green] dark:text-green-500">
                Total Present : {reportData.totalPresent}
              </span>
              <span className="font-semibold text-[color:red]  dark:text-red-500">
                Total Absent : {reportData.totalAbsent}
              </span>
            </div>
          )}
        </div>

        <AttendanceTable
          allChecked={allChecked}
          handleChange={handleChange}
          checkedValues={checkedValues}
          data={reportData}
          onViewClick={onViewClick}
        />
        {/* month calender and table */}
        <DrawerComponent
          open={drawer}
          setOpen={setDrawer}
          title={
            <div>
              <p>{selectedStudent?.student?.studentName}</p>
              <p className="text-sm">{`${selectedStudent.class_master?.name} ${selectedStudent.stream_master?.name} ${selectedStudent.section_master?.name}`}</p>
            </div>
          }
          size={drawerType === "calender" ? "352px" : "520px"}
          body={
            <>
              {drawerType === "calender" ? (
                <>
                  {monthlyStudentAttendanceData ? (
                    <>
                      <ReportMonthCalender
                        monthlyStudentAttendanceData={
                          monthlyStudentAttendanceData
                        }
                      />
                      <div className="capitalize flex flex-wrap gap-1.5 mt-2">
                        <p className="bg-green-700 text-white flex-1 text-center  rounded-md px-2 py-1.5 text-sm font-semibold ">
                          <span>Present </span>
                          <span>
                            <span>{selectedStudent?.totalPresent}</span>
                          </span>
                        </p>
                        <p className="bg-red-600 text-white flex-1 text-center  rounded-md px-2 py-1.5 text-sm font-semibold ">
                          <span>Absent </span>
                          <span>{selectedStudent?.totalAbsent}</span>
                        </p>
                        <p className="bg-yellow-500 text-white flex-1 text-center  rounded-md px-2 py-1.5 text-sm font-semibold ">
                          <span>Holiday </span>
                          <span>{selectedStudent?.holidays}</span>
                        </p>
                      </div>
                    </>
                  ) : (
                    <LoaderSpiner hw={30} color={true} />
                  )}
                </>
              ) : (
                <>
                  {/* {type === "year" && (
                    <button
                      onClick={() => {
                        window.print();
                      }}
                      className="btn btn-primary mb-4 ms-auto"
                    >
                      <MdLocalPrintshop className="text-base" />
                      Print
                    </button>
                  )} */}
                  <div
                    id="attendancePrint"
                    className="monthAttendanceTableRecord border rounded-md mb-6"
                  >
                    <table className="w-full border dark:border-gray-500 border-r-gray-200  rounded-md overflow-hidden">
                      <thead>
                        <tr className="border dark:border-gray-500 border-r-gray-200 bg-[color:var(--background)] text-white">
                          <td className="border  dark:border-gray-500 border-r-gray-200 px-2 py-1">
                            Date
                          </td>
                          <td className="border min-w-24 dark:border-gray-500 border-r-gray-200 px-2 py-1">
                            Attendance
                          </td>

                          <td className="border min-w-[36px] dark:border-gray-500 border-r-gray-200 px-2 py-1">
                            In
                          </td>
                          <td className="border min-w-[36px] dark:border-gray-500 border-r-gray-200 px-2 py-1">
                            Out
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        {reportTableData?.map((item, i) => {
                          return (
                            <tr
                              key={i}
                              className="border dark:border-gray-500 border-r-gray-200 even:bg-gray-50 dark:even:bg-[color:var(--background-dark-light)]"
                            >
                              <td className="border  capitalize dark:border-gray-500 border-r-gray-200 px-2 py-1   ">
                                {item.date}
                              </td>
                              <td className="border  capitalize dark:border-gray-500 border-r-gray-200 px-2 py-1   ">
                                {item.isPresent === 1 && "Present"}
                                {item.isPresent === 0 && "Absent"}
                                {item.isPresent === 3 && "Sunday"}
                              </td>
                              <td className="border  capitalize dark:border-gray-500 border-r-gray-200 px-2 py-1   ">
                                {item.inTime}
                              </td>
                              <td className="border  capitalize dark:border-gray-500 border-r-gray-200 px-2 py-1   ">
                                {item.outTime}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          }
        />
        {/* year calenders and table*/}
        <DrawerComponent
          open={yearCalenderDrawer}
          setOpen={setYearCalenderDrawer}
          title={
            <div>
              <p>{selectedStudent?.student?.studentName}</p>
              <p className="text-sm">{`${selectedStudent.class_master?.name} ${selectedStudent.stream_master?.name} ${selectedStudent.section_master?.name}`}</p>
            </div>
          }
          size={"1020px"}
          body={
            <>
              <div className="pb-6 yearly">
                {yearlyStudentAttendanceData ? (
                  <>
                    <ReportYearCalender
                      yearlyStudentAttendanceData={yearlyStudentAttendanceData}
                    />
                  </>
                ) : (
                  <LoaderSpiner hw={30} color={true} />
                )}
              </div>
            </>
          }
        />
      </div>
    </>
  );
}

export default AttendanceReport;
