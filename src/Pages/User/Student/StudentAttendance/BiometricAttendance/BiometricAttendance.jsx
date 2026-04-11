import { LuDownload } from "react-icons/lu";
import { userApi } from "../../../../../Service/api";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getMasterAllData } from "../../../Master/masterService";
import { useForm } from "react-hook-form";
import UseFilter from "../../../../../Hooks/UseFilter";
import BioTable from "./BioTable";
import LoaderSpiner from "../../../../../Components/Loaders/LoaderSpiner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
function BiometricAttendance() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);

  const [masterData, setMasterData] = useState();
  const masterStoreData = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const { register, handleSubmit, setValue } = useForm();
  const [bioAttendanceData, setBioAttendanceData] = useState({ student: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (
      !masterStoreData?.find((it) => it.type === "class") &&
      !masterStoreData?.find((it) => it.type === "stream") &&
      !masterStoreData?.find((it) => it.type === "section")
    ) {
      getMasterAllData(dispatch);
    } else setMasterData(masterStoreData);
  }, [masterStoreData]);

  async function handleGetBioAttendance(data) {
    try {
      setIsLoading(true);
      const res = await userApi.bioAttendance({ ...data, sessionMasterId });
      setIsLoading(false);

      const student = res.data.data?.student.map((item) => {
        return {
          ...item,
          studentName: item.student_master.studentName,
          attendance: item.attendance.map((att) => {
            return {
              ...att,
              isPresent:
                (att.isPresent === 1 && "P") ||
                (att.isPresent === 0 && "A") ||
                (att.isPresent === 2 && " "),
            };
          }),
        };
      });
      setBioAttendanceData({ ...res.data.data, student });
    } catch (error) {
      console.error("error in bio metric", error.message);
      return null;
    }
  }

  const { query, setQuery, filteredData } = UseFilter(
    bioAttendanceData?.student,
    "studentName"
  );

  
  const prepareDataForDownload = (apiData) => {
    const students = apiData.student.map((student) => {
      const baseInfo = {
        admissionNo: student.admissionNo,
        studentName: student.student_master.studentName,
        fathersName: student.student_master.fathersName,
      };

      const attendances = student.attendance.reduce((acc, attendance) => {
        const date = new Date(attendance.date).toLocaleDateString();
        acc[date] = attendance.isPresent;
        return acc;
      }, {});

      return { ...baseInfo, ...attendances };
    });

    return students;
  };



  const handleDownload = (apiData) => {
    const preparedData = prepareDataForDownload(apiData);

    const worksheet = XLSX.utils.json_to_sheet(preparedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance Data");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "biometric_attendance.xlsx");
  };
  useEffect(() => {
    setValue("date", moment(new Date()).format("YYYY-MM-DD"));
  }, []);
  return (
    <>
      <div className="card p-4 mb-4">
        <form onSubmit={handleSubmit(handleGetBioAttendance)}>
          <div className="grid grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-8 lg:gap-5 pt-3">
            <div className="inputBox">
              <input
                required
                type={"date"}
                className={`formControl `}
                {...register("date")}
              />
              <label className="pr-12" htmlFor={"id"}>
                Date <span className="text-red-600"> *</span>
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

      <div className="card p-4">
        <div className="flex items-center justify-between gap-2 mb-6 lg:flex-col lg:gap-5 lg:items-stretch ">
          <div className="inputBox w-full max-w-[250px] lg:max-w-full">
            <input
              required
              type={"text"}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              value={query}
              className={`formControl `}
            />
            <label htmlFor={"id"}>Search</label>
          </div>
          <div className="flex items-center gap-10 lg:flex-col lg:gap-4  lg:items-end">
            {/* {bioAttendanceData?.student?.length ? (
              <div className="flex items-center justify-end gap-4 sm:flex-wrap lg:gap-2">
                <span className="text-sm font-medium">
                  Total Student: {bioAttendanceData?.totalStudents}
                </span>
                <span className="text-sm font-medium text-[color:green] dark:text-green-500">
                  Total Present: {bioAttendanceData?.totalPresent}
                </span>
                <span className="text-sm font-medium text-[color:red]  dark:text-red-500">
                  Total Absent: {bioAttendanceData?.totalAbsent}
                </span>
              </div>
            ) : (
              ""
            )} */}
            <div className="flex items-center gap-3 hideOnPrint">
              <button
                disabled={!bioAttendanceData?.student?.length}
                onClick={() => {
                  handleDownload(bioAttendanceData);
                }}
                className={`btn-excel ${
                  bioAttendanceData?.student?.length
                    ? ""
                    : " opacity-50 pointer-events-none"
                }`}
              >
                <LuDownload />
                Download Excel
              </button>
            </div>
          </div>
        </div>
        <BioTable data={filteredData} />
      </div>
    </>
  );
}

export default BiometricAttendance;
