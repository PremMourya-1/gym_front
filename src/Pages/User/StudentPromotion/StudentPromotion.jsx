import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMasterAllData } from "../Master/masterService";
import { useForm } from "react-hook-form";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import studentPromotionList, { promoteStudent } from "./promotionService";
import UseFilter from "../../../Hooks/UseFilter";
import Table from "../../../Components/Table/Table";
import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import { Steps } from "rsuite";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";

function StudentPromotion() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);

  const [step, setStep] = useState(0);
  const [modal, setModal] = useState(false);

  const { register, handleSubmit, reset } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    reset: reset2,
  } = useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [masterData, setMasterData] = useState();
  const masterStoreData = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [studentList, setStudentList] = useState([]);
  useEffect(() => {
    if (
      !masterStoreData?.find((it) => it.type === "class") &&
      !masterStoreData?.find((it) => it.type === "stream") &&
      !masterStoreData?.find((it) => it.type === "section")
    ) {
      getMasterAllData(dispatch);
    } else setMasterData(masterStoreData);
  }, [masterStoreData]);

  function handleGetClassStudent(data) {
    studentPromotionList(
      { ...data, sessionMasterId },
      setStudentList,
      setIsLoading,
      setStep
    );
  }

  const { query, setQuery, filteredData } = UseFilter(
    studentList,
    "studentName"
  );
  const [checkedValues, setCheckedValues] = useState({});

  const [allChecked, setAllChecked] = useState();

  useEffect(() => {
    setAllChecked(true);
    let trueObj = {};
    filteredData?.forEach((item) => {
      trueObj[item.student_master.id] = true;
    });
    setCheckedValues(trueObj);
  }, [studentList]);
  useEffect(() => {
    if (
      Object.values(checkedValues)?.length === filteredData?.length &&
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
        filteredData?.forEach((item) => {
          trueObj[item.student_master.id] = true;
        });

        setCheckedValues(trueObj);
      } else {
        let falseObj = {};
        filteredData?.forEach((item) => {
          falseObj[item.student_master.id] = false;
        });
        setCheckedValues(falseObj);
        setAllChecked(false);
      }
    } else {
      setCheckedValues({ ...checkedValues, [id]: value });
    }
  }
  const columns = [
    {
      width: "80px",
      title: () => {
        return (
          <>
            <input
              id="all"
              type="checkbox"
              className="form-check-input h-4 w-4 accent-[color:var(--primary-dark)] "
              onChange={handleChange}
              checked={allChecked}
              disabled={!filteredData.length}
            />
          </>
        );
      },
      selector: (row) => {
        return (
          <>
            <input
              type="checkbox"
              className="form-check-input h-4 w-4 accent-[color:var(--primary-dark)] "
              id={row.student_master.id}
              onChange={handleChange}
              checked={checkedValues[row.student_master.id]}
            />
          </>
        );
      },
    },
    {
      title: "Adm No",
      selector: (row) => row.student_master.admissionNo,
    },
    {
      title: "Device Id",
      selector: (row) => row.student_master.deviceId,
    },
    {
      title: "Student Name",
      selector: (row) => row.studentName,
    },
    {
      title: "Father's Name",
      selector: (row) => row.student_master.fathersName,
    },
  ];
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promotePayload, setPromotePayload] = useState();
  function handlePromoteStudent(data) {
    const payload = { ...data, studentId: selectedStudents };
    setPromotePayload(payload);
    setModal(true);
  }

  useEffect(() => {
    const studentdata = [];
    Object.keys(checkedValues).forEach((item) => {
      if (checkedValues[item]) studentdata.push(item);
    });
    setSelectedStudents(studentdata);
  }, [checkedValues]);

  function handleSurePromote() {
    promoteStudent(
      promotePayload,
      setLoading,
      setStep,
      reset,
      reset2,
      setModal
    );
  }
  return (
    <>
      <div className="breadCrumbAndSearchBar">
        <BreadCrumb />
      </div>
      <div className="card p-4 mb-4">
        <div className="max-w-[70%] lg:max-w-full m-auto">
          <Steps current={step} className="md:items-start sm:flex-col md:gap-3">
            <Steps.Item
              className="dark:text-gray-400 md:w-full"
              title="Select Class"
            />
            <Steps.Item
              className="dark:text-gray-400 md:w-full"
              title="Select Students"
            />
            <Steps.Item
              className="dark:text-gray-400 md:w-full"
              title="Promote Class"
            />
          </Steps>
        </div>
      </div>
      {step == 0 && (
        <div className="card  p-4 mb-4 mt-1 md:mt-2.5">
          <form
            onSubmit={handleSubmit(handleGetClassStudent)}
            className="flex items-end gap-6 sm:flex-col"
          >
            <div className="grid grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 gap-8 lg:gap-5 w-full pt-3">
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
                  Select section <span className="text-red-600"> *</span>
                </label>
              </div>
            </div>

            <button disabled={isLoading} className="btn ms-auto btn-primary">
              {isLoading ? <LoaderSpiner /> : "Next"}
            </button>
          </form>
        </div>
      )}
      {step === 1 && (
        <>
          <div className="card p-4 mb-4 mt-1 md:mt-2.5 max-h-screen overflow-y-scroll">
            <div className="max-w-[300px] mb-4 ">
              <div className="inputBox ">
                <input
                  onChange={(e) => {
                    setQuery(e.target.value);
                  }}
                  value={query}
                  required
                  type={"textarea"}
                  className={`formControl `}
                />
                <label htmlFor={"id"}>Search</label>
              </div>
            </div>
            <Table columns={columns} data={filteredData} />
          </div>
          <div className="card p-4">
            <div className="buttons flex justify-end gap-3 ">
              <button
                onClick={() => {
                  setStep(0);
                }}
                type="submit"
                className={`  btn btn-primary`}
              >
                Back
              </button>
              <button
                onClick={() => {
                  setStep(2);
                }}
                disabled={!selectedStudents.length}
                type="submit"
                className={` ${
                  !selectedStudents.length && "opacity-45 pointer-events-none"
                } btn btn-primary`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="card py-5 px-3 ">
          <form onSubmit={handleSubmit2(handlePromoteStudent)} className="">
            <div className="grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 gap-8 lg:gap-5 pt-3 w-full">
              <div className="inputBox">
                <select
                  className="formControl"
                  required
                  {...register2("classMasterId")}
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
                  {...register2("streamMasterId")}
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
                  {...register2("sectionMasterId")}
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
                  Select section <span className="text-red-600"> *</span>
                </label>
              </div>
              <div className="inputBox">
                <select
                  className="formControl"
                  required
                  {...register2("sessionMasterId")}
                >
                  <option value="" hidden>
                    --Session--
                  </option>
                  {masterData
                    ?.find((it) => it.type === "session")
                    ?.data.map((item) => {
                      if (Number(item.id) !== sessionMasterId) {
                        return (
                          <option key={item.id} value={item.id}>
                            {item.sessionName}
                          </option>
                        );
                      }
                    })}
                </select>
                <label htmlFor={"id"}>
                  Select Session <span className="text-red-600"> *</span>
                </label>
              </div>
            </div>
            <div className="buttons flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setStep(1);
                }}
                disabled={!selectedStudents.length}
                type="button"
                className={` ${
                  !selectedStudents.length && "opacity-45 pointer-events-none"
                } btn btn-primary`}
              >
                Back
              </button>

              <button
                disabled={!selectedStudents.length || loading}
                type="submit"
                className={` ${
                  !selectedStudents.length && "opacity-45 pointer-events-none"
                } btn btn-primary`}
              >
                {loading ? <LoaderSpiner /> : "Promote Student"}
              </button>
            </div>
          </form>
        </div>
      )}

      <CustomModal
        isHeader={false}
        open={modal}
        setOpen={setModal}
        onConfirm={handleSurePromote}
        loading={isLoading}
        body={
          <>
            <ConfirmModal
              message={
                "Are you sure you want to promote thease student to the next class?"
              }
            />
          </>
        }
      />
    </>
  );
}

export default StudentPromotion;
