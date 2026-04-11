import { LuDownload } from "react-icons/lu";
import { useEffect, useState } from "react";
import xlFile from "../../../../../Assets/file/bulk_xl_file.xlsx";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { XL_FILE_TYPE } from "../../../../../Constant/Constant";
import * as XLSX from "xlsx";
import BulkStudentTable from "./BulkStudentTable";
import DrawerComponent from "../../../../../Components/Drawer/Drawer";
import {
  bulkAdmission,
  getOldStudentData,
} from "../../StudentLIst/studentService";
import filterBulkStudentData from "./filterBulkStudentData";
import LoaderSpiner from "../../../../../Components/Loaders/LoaderSpiner";
import { getMasterAllData } from "../../../Master/masterService";
import excelDateToJSDate from "../../../../../Utils/xlDateToJsDate";
import moment from "moment";
import getShiftData from "../../../Shift/shiftService";
import Tippy from "@tippyjs/react";
import { Link } from "react-router-dom";

function BulkAdmission({ open, setOpen, planStudentCount }) {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData.id);
  const [bulkStudentListDrawer, setBulkStudentListDrawer] = useState(false);
  const [bulkStudentCommonData, setBulkStudentCommonData] = useState({}); //
  const [bulkStudentPayloadData, setBulkStudentPayloadData] = useState();
  const [checkedValues, setCheckedValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const existingStudentsInDb = useSelector(
    (state) => state.existingStudent?.filter((it) => it.status === 1)?.length
  );

  const [xlFileError, setXlFileError] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [xlData, setXlData] = useState(null);
  console.log(xlData);

  const [oldStudentData, setOldStudentData] = useState([]);

  const [masterData, setMasterData] = useState();
  const masterStoreData = useSelector((state) => state.master);
  const existingStudentStoreData = useSelector(
    (state) => state.existingStudent
  );
  useEffect(() => {
    if (
      !masterStoreData?.find((it) => it.type === "class") &&
      !masterStoreData?.find((it) => it.type === "stream") &&
      !masterStoreData?.find((it) => it.type === "section")
    ) {
      getMasterAllData(dispatch);
    } else setMasterData(masterStoreData);
  }, [masterStoreData]);

  useEffect(() => {
    if (!existingStudentStoreData) {
      (async () => {
        await getOldStudentData({ sessionMasterId }, dispatch);
      })();
    } else setOldStudentData(existingStudentStoreData);
  }, [existingStudentStoreData]);

  const [shiftList, setShiftList] = useState();

  const shiftStoreData = useSelector((state) => state.shift);

  useEffect(() => {
    !shiftStoreData ? getShiftData(dispatch) : setShiftList(shiftStoreData);
  }, [shiftStoreData]);

  const {
    register,
    handleSubmit,
    // reset,
    // formState: { errors },
  } = useForm();

  async function showXlStudentList(data) {
    const fileType = XL_FILE_TYPE;
    if (selectedFile.type.includes(fileType)) {
      setOpen(false);
      setXlFileError(false);
      setBulkStudentListDrawer(true);

      setBulkStudentCommonData({
        ...data,
        shiftId: Number(data.shiftId),
        sessionMasterId,
      });
    } else {
      setXlFileError(true);
    }
  }

  function onchangeXlFile(e) {
    if (e.target.files[0]?.type.includes(XL_FILE_TYPE)) {
      setXlFileError(false);
      // right xl file
      const file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        const result = e.target.result;
        const workBook = XLSX.read(result, { type: "buffer" });
        const workSheetName = workBook.SheetNames[0];
        const workSheet = workBook.Sheets[workSheetName];
        const data = XLSX.utils.sheet_to_json(workSheet);
        const afterAdedId = data.map((item, i) => {
          return { ...item, id: i + 1 };
        });

        const formatedDate = afterAdedId.map((item) => {
          return {
            ...item,
            admissionDate: moment(excelDateToJSDate(item.admissionDate)).format(
              "YYYY-MM-DD"
            ),
          };
        });
        setXlData(formatedDate);
      };
    } else {
      setXlFileError(true);
    }
  }
  useEffect(() => {
    if (xlData) {
      const filtered = filterBulkStudentData(
        xlData,
        oldStudentData,
        checkedValues
      );

      setBulkStudentPayloadData(filtered);
    }
  }, [xlData, checkedValues]);

  function handleImportBulkStudent() {
    const filtered = bulkStudentPayloadData.map(({ id, ...rest }) => {
      return rest;
    });
    const payload = {
      masterData: bulkStudentCommonData,
      students: filtered,
    };

    setOpen(false);
    // return;
    bulkAdmission(payload, dispatch, setIsLoading, setBulkStudentListDrawer);
  }

  // useEffect(() => {
  //   !open && setXlData([]);
  // }, [open]);

  return (
    <>
      <DrawerComponent
        size={"550px"}
        setOpen={setOpen}
        open={open}
        title={"Bulk Student Admission"}
        body={
          <>
            {xlData?.length > planStudentCount - existingStudentsInDb && (
              <div className="alertMessage  text-center mb-8">
                <p>
                  You can only admit {planStudentCount - existingStudentsInDb}{" "}
                  more students to reach your {"plan s"} limit of{" "}
                  {planStudentCount} Your upload contains more than{" "}
                  {planStudentCount - existingStudentsInDb} students. Please
                  <Link
                    to={"/settings/upgrade-plan"}
                    className=" text-blue-600 hover:text-blue-700"
                  >
                    {" "}
                    Upgrade{" "}
                  </Link>
                  your plan and try again.
                </p>
              </div>
            )}
            <div className="flex mb-4 justify-between items-center   border-[color:var(--background)] dark:border-[color:var(--border-dark-color)]">
              <p>Please download sample file </p>
              <Tippy content="Download Sample File">
                <a
                  href={xlFile}
                  download={"Bulk_Student_Admission_XL_File"}
                  className="btn btn-excel w-max"
                >
                  <span>
                    <LuDownload />
                  </span>
                  Download
                </a>
              </Tippy>
            </div>
            <form onSubmit={handleSubmit(showXlStudentList)}>
              <div className="grid grid-cols-2 gap-8 lg:gap-5">
                <div className="col-span-2">
                  <div className="inputBox">
                    <input
                      required
                      type={"file"}
                      className={`formControl ${
                        selectedFile ? "" : "text-transparent appearance-none"
                      } `}
                      onChange={(e) => {
                        setSelectedFile(e.target.files[0]);
                        onchangeXlFile(e);
                      }}
                    />
                    <label className="pt-3 pe-16" htmlFor={"id"}>
                      Choose Excel File <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  {xlFileError && (
                    <p className="text-red-600 text-[12px] font-semibold ">
                      Please select a valid Excel file (xlsx format)
                    </p>
                  )}
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
                <div className="inputBox">
                  <select
                    className="formControl"
                    required
                    {...register("shiftId")}
                  >
                    <option value="" hidden>
                      --Shift--
                    </option>
                    {shiftList?.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  <label htmlFor={"id"}>
                    Select Shift <span className="text-red-600"> *</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-7">
                <button
                  disabled={
                    xlFileError ||
                    xlData?.length > planStudentCount - existingStudentsInDb
                  }
                  className={` ${
                    xlFileError ||
                    xlData?.length > planStudentCount - existingStudentsInDb
                      ? "cursor-not-allowed pointer-events-none opacity-50"
                      : ""
                  } btn  btn-primary w-max `}
                >
                  Next{" "}
                </button>
              </div>
            </form>
          </>
        }
      />
      <DrawerComponent
        size={"1200px"}
        setOpen={setBulkStudentListDrawer}
        open={bulkStudentListDrawer}
        title={"Bulk Student Admission"}
        body={
          <>
            <div className="flex gap-3 mb-4 items-center">
              <span className=" gap-2 before:mb-1 before:inline-block before:h-4 before:w-4 before:bg-yellow-600 before:rounded-full before:mr-0.5 flex items-center">
                Exist in Xl file
              </span>
              <span className=" gap-2 before:mb-1 before:inline-block before:h-4 before:w-4 before:bg-red-600 before:rounded-full before:mr-0.5 flex items-center">
                Exist
              </span>
            </div>

            <BulkStudentTable
              data={xlData}
              oldData={oldStudentData}
              checkedValues={checkedValues}
              setCheckedValues={setCheckedValues}
            />
            <div className="card p-3">
              <button
                disabled={isLoading || !bulkStudentPayloadData?.length}
                onClick={() => {
                  handleImportBulkStudent();
                }}
                type="button"
                className={`btn ${
                  isLoading || !bulkStudentPayloadData?.length
                    ? "opacity-45 pointer-events-none"
                    : ""
                } btn-primary mt-2 ms-auto`}
              >
                {isLoading ? <LoaderSpiner /> : "Import"}
              </button>
            </div>
          </>
        }
      />
    </>
  );
}

export default BulkAdmission;
