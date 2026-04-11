import { RiFileExcel2Line } from "react-icons/ri";
import { FaUserGraduate } from "react-icons/fa6";
import { useEffect, useState } from "react";

import SingleStudentAdmission from "./SingleStudentAdmission";
import { useDispatch, useSelector } from "react-redux";
import { getMasterAllData } from "../../Master/masterService";
import BulkAdmission from "./BulkStudent/BulkAdmission";
import { getOldStudentData } from "../StudentLIst/studentService";
import Tippy from "@tippyjs/react";
import getStudentLimit from "../../Plan/planService";

export default function StudentAdmission() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData.id);

  const [planStudentCount, setPlanStudentCount] = useState();
  useEffect(() => {
    getStudentLimit(setPlanStudentCount);
  }, []);

  const [singleStudentDrawer, setSingleStudentDrawer] = useState(false);
  const [bulkStudentDrawer, setBulkStudentDrawer] = useState(false);
  const dispatch = useDispatch();
  const [masterData, setMasterData] = useState();
  const masterStoreData = useSelector((state) => state.master);

  const existingStudentsInDb = useSelector(
    (state) => state?.existingStudent?.filter((it) => it.status === 1)?.length
  );
  const [existingStudentData, setExistingStudentData] = useState();

  useEffect(() => {
    (async () => {
      const res = await getOldStudentData({ sessionMasterId }, dispatch);
      setExistingStudentData(res.data.data);
    })();
  }, []);

  useEffect(() => {
    if (
      !masterStoreData?.find((it) => it.type === "class") ||
      !masterStoreData?.find((it) => it.type === "stream") ||
      !masterStoreData?.find((it) => it.type === "section")
    ) {
      getMasterAllData(dispatch);
    } else setMasterData(masterStoreData);
  }, [masterStoreData]);
  return (
    <>
      {planStudentCount <= existingStudentsInDb && (
        <div className="alertMessage mb-4 text-center">
          <p>
            You have reached the maximum limit of {`"${existingStudentsInDb}"`}{" "}
            student admissions for your current plan. Please upgrade your plan
            to admit more students and continue managing your attendance
            seamlessly.
          </p>
        </div>
      )}
      <div
        className={` ${
          planStudentCount <= existingStudentsInDb &&
          "opacity-45 pointer-events-none"
        } grid grid-cols-2 gap-4 md:grid-cols-1 md:gap-2`}
      >
        <Tippy content="Single Student Admission" placement="bottom">
          <div
            onClick={() => {
              planStudentCount > existingStudentsInDb &&
                setSingleStudentDrawer(true);
            }}
            className="card p-10  md:p-5 flex flex-col gap-5 justify-center items-center cursor-pointer hover:shadow-lg dark:hover:shadow-gray-800 transition3"
          >
            <FaUserGraduate className="text-5xl  fill-gray-700 dark:fill-white text-center" />
            <span className="text-2xl font-medium text-center md:text-lg sm:text-base">
              Student Admission
            </span>
          </div>
        </Tippy>
        <Tippy content="Student Admission By XL Data" placement="bottom">
          <div
            onClick={() => {
              planStudentCount > existingStudentsInDb &&
                setBulkStudentDrawer(true);
            }}
            className="card p-10 md:p-5 flex flex-col gap-5 justify-center items-center cursor-pointer hover:shadow-lg dark:hover:shadow-gray-800 transition3"
          >
            <RiFileExcel2Line className="text-5xl  fill-gray-700 dark:fill-white text-center" />
            <span className="text-2xl font-medium text-center md:text-lg sm:text-base">
              Bulk Student Admission
            </span>
          </div>
        </Tippy>
      </div>

      <SingleStudentAdmission
        open={singleStudentDrawer}
        setOpen={setSingleStudentDrawer}
        masterData={masterData}
        oldData={existingStudentData}
      />

      <BulkAdmission
        open={bulkStudentDrawer}
        setOpen={setBulkStudentDrawer}
        masterData={masterData}
        planStudentCount={planStudentCount}
      />
    </>
  );
}
