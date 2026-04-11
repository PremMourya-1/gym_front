import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getMasterAllData } from "../../Master/masterService";
import LoaderSpiner from "../../../../Components/Loaders/LoaderSpiner";
import BreadCrumb from "../../../../Components/Common/BreadCrumb/BreadCrumb";
import downloadXl from "../../../../Utils/downloadXl";
import { LuDownload } from "react-icons/lu";
import getRegisterData from "./registerService";
import { Link } from "react-router-dom";
import { IoMdPrint } from "react-icons/io";
import { setLocaleStorageItem } from "../../../../Utils/localeStorage";
import { PRINT_ATTENDANCE_REGISTER } from "../../../../Constant/Constant";
import NoRecords from "../../../../Components/NoRecords/NoRecords";

function AttendanceRegister() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);

  const { register, handleSubmit } = useForm();
  const [masterData, setMasterData] = useState();
  const masterStoreData = useSelector((state) => state.master);
  const [isLoading, setIsLoading] = useState(false); // for getting complite student data
  const [registerData, setRegisterData] = useState(null);

  const dispatch = useDispatch();
  useEffect(() => {
    if (
      !masterStoreData?.find((it) => it.type === "class") ||
      !masterStoreData?.find((it) => it.type === "stream") ||
      !masterStoreData?.find((it) => it.type === "section")
    ) {
      getMasterAllData(dispatch);
    } else setMasterData(masterStoreData);
  }, [masterStoreData]);

  const [printPayload, setPrintPayload] = useState({});

  function handleGetRegisterData(data) {
    setLocaleStorageItem(PRINT_ATTENDANCE_REGISTER, data);
    setPrintPayload(data);
    getRegisterData(
      { ...data, sessionMasterId },
      setIsLoading,
      setRegisterData,
    );
  }

  const generateColumns = (presetData) => {
    const columns = [{ name: "Student", selector: (row) => row.name }];

    presetData.dates.forEach((date, index) => {
      columns.push({ name: date, selector: (row) => row.attendance[index] });
    });

    return columns;
  };

  // useEffect(() => {
  // const subscription = watch((value, { name }) => {
  // if (name === "classMasterId") {
  //   const classObj = masterData
  //     ?.find((it) => it.type === "class")
  //     .data.find((it) => it.id === Number(value.classMasterId));
  //   setPrintPayload((prev) => {
  //     return { ...prev, className: classObj?.name };
  //   });
  // }
  // if (name === "streamMasterId") {
  //   const streamObj = masterData
  //     ?.find((it) => it.type === "stream")
  //     .data.find((it) => it.id === Number(value.streamMasterId));
  //   setPrintPayload((prev) => {
  //     return { ...prev, streamName: streamObj?.name };
  //   });
  // }
  // if (name === "sectionMasterId") {
  //   const sectionObj = masterData
  //     ?.find((it) => it.type === "section")
  //     .data.find((it) => it.id === Number(value.sectionMasterId));
  //   setPrintPayload((prev) => {
  //     return { ...prev, sectionName: sectionObj?.name };
  //   });
  // }
  // if (name === "month") {
  //   setPrintPayload((prev) => {
  //     return { ...prev, month: value.month };
  //   });
  // }
  // });
  // return () => subscription.unsubscribe();
  // }, [watch]);

  return (
    <>
      <div className="flex justify-between card p-3 mb-4 items-center sm:flex-col sm:items-start gap-3">
        <BreadCrumb />
        <div className="flex items-center gap-3 ">
          <Link
            state={registerData}
            target="_blank"
            to={`/attendance/attendance-register/print/${printPayload.classMasterId}-${printPayload.streamMasterId}-${printPayload.sectionMasterId}-${printPayload.month}`}
            className={`btn-print ${
              registerData?.students?.length
                ? ""
                : "opacity-50 pointer-events-none"
            }`}
          >
            <IoMdPrint />
            Print
          </Link>
          <button
            disabled={!registerData?.students?.length}
            onClick={() => {
              downloadXl(
                generateColumns(registerData),
                registerData?.students,
                "register.xlsx",
              );
            }}
            className={`btn-excel shrink-0 ${
              registerData?.students?.length
                ? ""
                : "opacity-50 pointer-events-none"
            }  shrink-0 sm:ms-auto`}
          >
            <LuDownload />
            Download Excel
          </button>
        </div>
      </div>
      <div className="card p-4 mb-4 mt-1 md:mt-2.5">
        <form
          onSubmit={handleSubmit(handleGetRegisterData)}
          className="flex  gap-6 items-end md:flex-col md:gap-4"
        >
          <div className="grid grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-2 gap-8 lg:gap-5 pt-3 w-full">
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
          </div>

          <button disabled={isLoading} className="btn ms-auto btn-primary ">
            {isLoading ? <LoaderSpiner /> : "Get"}
          </button>
        </form>
      </div>
      <div className="card p-4">
        {registerData?.students?.length ? (
          <div className="tableParent min-w-[600px] overflow-x-auto CustomScrollBar">
            <table className="w-full border dark:border-gray-500 border-r-gray-200  rounded-md overflow-hidden">
              <thead>
                <tr className="border dark:border-gray-500 border-r-gray-200 bg-[color:var(--background)] text-white">
                  <td className="border min-w-44 dark:border-gray-500 border-r-gray-200 px-2 py-1">
                    Student
                  </td>
                  <td className="border min-w-24 dark:border-gray-500 border-r-gray-200 px-2 py-1">
                    Adm No
                  </td>

                  {registerData?.dates?.map((item, i) => {
                    return (
                      <>
                        <td
                          className="border min-w-[36px] dark:border-gray-500 border-r-gray-200 px-2 py-1"
                          key={i}
                        >
                          {item?.split("-")[2]}
                        </td>
                      </>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {registerData?.students?.map((item, i) => {
                  return (
                    <tr
                      key={i}
                      className="border dark:border-gray-500 border-r-gray-200 even:bg-gray-50 dark:even:bg-[color:var(--background-dark-light)]"
                    >
                      <td className="border  capitalize dark:border-gray-500 border-r-gray-200 px-2 py-1   ">
                        {item.name}
                      </td>
                      <td className="border  capitalize dark:border-gray-500 border-r-gray-200 px-2 py-1   ">
                        {item.admissionNo}
                      </td>

                      {item.attendance.map((item, i) => {
                        return (
                          <td
                            className="border dark:border-gray-500 border-r-gray-200 px-2 py-1"
                            key={i}
                          >
                            <span
                              className={` ${
                                (item === "H" && "bg-yellow-500") ||
                                (item === "S" && "bg-yellow-500") ||
                                (item === "P" && "bg-green-600") ||
                                (item === "A" && "bg-red-600")
                              }  h-5 w-5 text-[10px] text-white font-semibold rounded-full flex items-center justify-center`}
                            >
                              {item}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <NoRecords />
        )}
      </div>
    </>
  );
}

export default AttendanceRegister;
