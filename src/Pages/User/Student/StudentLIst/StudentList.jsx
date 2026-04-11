import { LuPlus } from "react-icons/lu";
import StudentListTable from "./StudentListTable";
import { useDispatch, useSelector } from "react-redux";
import { useContext, useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { useForm } from "react-hook-form";
import getStudentData, {
  addAndEditStudent,
  deleteStudent,
} from "./studentService";
import { getMasterAllData } from "../../Master/masterService";
import Pagination from "../../../../Components/Pagination/Pagination";
import { LoaderContext } from "../../../../Context/LoaderContext";
import { Link, useNavigate } from "react-router-dom";
import DrawerComponent from "../../../../Components/Drawer/Drawer";
import notRequiredInput, { inputBlur } from "../../../../Utils/notRequired";
import LoaderSpiner from "../../../../Components/Loaders/LoaderSpiner";
import CustomModal from "../../../../Components/Modal/Modal";
import ConfirmModal from "../../../../Components/Modal/ConfirmModal";
import moment from "moment";
import BreadCrumb from "../../../../Components/Common/BreadCrumb/BreadCrumb";
import Image from "../../../../Components/Common/Image/Image";
import { IoIosCamera } from "react-icons/io";
import getShiftData from "../../Shift/shiftService";
// import DrawerComponent from "../../../../Components/Drawer/Drawer";

export default function StudentList() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [prevPhoto, setPrevPhoto] = useState(null);
  const [searchDrawer, setSearchDrawer] = useState(false); //

  const [photo, setPhoto] = useState(null);

  const { setTpLoader } = useContext(LoaderContext);
  const [admDevice, setAdmDevice] = useState({});
  const dispatch = useDispatch();

  const [masterData, setMasterData] = useState();
  const masterStoreData = useSelector((state) => state.master);

  useEffect(() => {
    if (
      !masterStoreData?.find((it) => it.type === "class") &&
      !masterStoreData?.find((it) => it.type === "stream") &&
      !masterStoreData?.find((it) => it.type === "section")
    ) {
      getMasterAllData(dispatch);
    } else setMasterData(masterStoreData);
  }, [masterStoreData]);

  const [studentMasterPayload, setStudentMasterPayload] = useState({
    classMasterId: "All",
    streamMasterId: "All",
    sectionMasterId: "All",
    isActive: "All",
  });
  const [filterData, setFilterData] = useState({
    limit: 10,
    page: 1,
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const [shiftList, setShiftList] = useState();

  const shiftStoreData = useSelector((state) => state.shift);

  useEffect(() => {
    reset();
    !shiftStoreData ? getShiftData(dispatch) : setShiftList(shiftStoreData);
  }, [shiftStoreData]);

  const studentStoreData = useSelector((state) => state.student);

  const [studentData, setStudentData] = useState();

  useEffect(() => {
    reset();
    !studentStoreData
      ? getStudentData(
          { sessionMasterId, ...filterData, ...studentMasterPayload },
          dispatch
        )
      : setStudentData({
          ...studentStoreData,
          data: studentStoreData.data.map((item) => {
            return { ...item, studentName: item.student_master.studentName };
          }),
        });
  }, [studentStoreData]);

  function handleFilterStudentList(e) {
    e?.preventDefault();
    const payload = { sessionMasterId, ...filterData, ...studentMasterPayload };
    getStudentData(payload, dispatch, setIsLoading, setSearchDrawer);
  }

  useEffect(() => {
    const payload = { sessionMasterId, ...filterData, ...studentMasterPayload };
    getStudentData(payload, dispatch, setIsLoading);
    window.scrollTo(0, 0);
  }, [filterData]);

  // useEffect(() => {
  //   handleFilterStudentList();
  // }, [filterData.page]);

  function handleEditStudent(data) {
    const payload = { ...data, sessionMasterId, photo };
    !photo && delete payload.photo;

    addAndEditStudent({
      payload,
      setIsLoading,
      isEditing,
      setOpen: setDrawer,
      dispatch,
      reset,
      navigate,
      listId,
    });
  }

  const [defaultValues, setDefaultValues] = useState({});
  function onEditClick(row) {
    setIsEditing(true);
    setListId(row.id);

    setValue("classMasterId", row.classMasterId);
    setValue("sectionMasterId", row.sectionMasterId);
    setValue("streamMasterId", row.streamMasterId);
    setValue("studentName", row.student_master.studentName);
    setValue("fathersName", row.student_master.fathersName);
    setValue("mothersName", row.student_master.mothersName);
    setValue("admissionDate", moment(row.admissionDate).format("YYYY-MM-DD"));
    setValue("address", row.student_master.address);
    setValue("email", row.student_master.email);
    setValue("contact", row.student_master.contact);
    setValue("alternateContact", row.student_master.alternateContact);
    setValue("deviceId", row.deviceId);
    setValue("shiftId", row.shiftId);
    setAdmDevice({ admissionNo: row.admissionNo, deviceId: row.deviceId });
    setPhoto(null);
    setPrevPhoto(row.student_master.photo);
    const dummyObj = {};
    if (row?.student_master?.mothersName) {
      dummyObj.mother = true;
    }
    if (row?.student_master?.alternateContact) {
      dummyObj.altNo = true;
    }
    if (row?.student_master?.email) {
      dummyObj.email = true;
    }
    setDefaultValues(dummyObj);
    setDrawer(true);
  }
  function onDeleteClick(id) {
    setModal(true);
    setListId(id);
  }

  function handleDeleteStudent() {
    deleteStudent(listId, setIsLoading, setModal, dispatch);
  }

  const [deactiveModal, setDeactiveModal] = useState(false);
  const [status, setStatus] = useState({});
  async function onChangeStatus(isActive, id) {
    setIsEditing(true);
    setListId(id);
    setDeactiveModal(true);
    setStatus({ isActive: Number(isActive), id });
  }
  function handleDeactive() {
    setTpLoader(true);
    addAndEditStudent({
      payload: status,
      setIsLoading,
      isEditing,
      setOpen: setDrawer,
      dispatch,
      reset,
      navigate,
      listId,
    });
    setDeactiveModal(false);
    setTpLoader(false);
  }

  return (
    <>
      <div className="breadCrumbAndSearchBar">
        <BreadCrumb />
        <div className="searchAndButton">
          <div className="buttons shrink-0 flex gap-2 md:w-full">
            <button
              onClick={() => {
                setSearchDrawer(true);
              }}
              className={`btn group  btn-primary md:w-full`}
            >
              <FaFilter className="h-4 w-4 group-hover:fill-white transition-none" />
            </button>
            <Link
              to={"/student/student-admission"}
              className={`btn group  btn-primary md:w-full`}
            >
              <LuPlus className="h-4 w-4 group-hover:fill-white transition-none" />
              {`Add  Student`}
            </Link>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden rounded-lg p-3 mt-1 md:mt-2.5">
        <StudentListTable
          data={studentData?.data}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
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

      <DrawerComponent
        size={"420px"}
        setOpen={setSearchDrawer}
        open={searchDrawer}
        title={"Search Student "}
        body={
          <>
            <form onSubmit={handleFilterStudentList} className="">
              <div className="grid grid-cols-1 w-full gap-4">
                <div className="inputBox">
                  <select
                    className="formControl"
                    required
                    onChange={(e) => {
                      setStudentMasterPayload((prev) => {
                        return { ...prev, classMasterId: e.target.value };
                      });
                    }}
                    value={studentMasterPayload.classMasterId}
                  >
                    <option value="">--Class--</option>
                    <option value="All">All</option>
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
                    className="formControl notRequired"
                    onChange={(e) => {
                      setStudentMasterPayload((prev) => {
                        return { ...prev, streamMasterId: e.target.value };
                      });
                    }}
                    onFocus={notRequiredInput}
                    onBlurCapture={inputBlur}
                  >
                    <option value="">--Stream--</option>
                    <option value="All">All</option>
                    {masterData
                      ?.find((it) => it.type === "stream")
                      ?.data.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  <label htmlFor={"id"}>Select Stream</label>
                </div>
                <div className="inputBox">
                  <select
                    className="formControl notRequired"
                    onChange={(e) => {
                      setStudentMasterPayload((prev) => {
                        return { ...prev, sectionMasterId: e.target.value };
                      });
                    }}
                    onFocus={notRequiredInput}
                    onBlurCapture={inputBlur}
                  >
                    <option value="">--section--</option>
                    <option value="All">All</option>
                    {masterData
                      ?.find((it) => it.type === "section")
                      ?.data.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                  <label htmlFor={"id"}>Select section</label>
                </div>
                <div className="inputBox">
                  <select
                    className="formControl notRequired"
                    onChange={(e) => {
                      setStudentMasterPayload((prev) => {
                        return { ...prev, isActive: e.target.value };
                      });
                    }}
                    onFocus={notRequiredInput}
                    onBlurCapture={inputBlur}
                    value={studentMasterPayload.isActive}
                  >
                    <option value="">--Type--</option>
                    <option value={"All"}>All</option>
                    <option value={1}>Active</option>
                    <option value={0}>De-active</option>
                  </select>
                  <label htmlFor={"id"}>Select Type</label>
                </div>
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="btn ms-auto btn-primary mt-4"
              >
                {isLoading ? <LoaderSpiner /> : "Get"}
              </button>
            </form>
          </>
        }
      />

      <DrawerComponent
        size={"900px"}
        setOpen={setDrawer}
        open={drawer}
        title={"Edit Student Details"}
        body={
          <>
            <form onSubmit={handleSubmit(handleEditStudent)}>
              <div className="flex gap-8 sm:flex-col">
                <div className="relative  studentProfilePicture  h-28 w-28 shrink-0 rounded-md border  dark:border-gray-500">
                  {photo ? (
                    <Image
                      dynamic={false}
                      url={photo && URL.createObjectURL(photo)}
                      alt={"student_profile"}
                      className={"rounded-md"}
                    />
                  ) : (
                    <Image
                      url={prevPhoto}
                      alt={"student_profile"}
                      className={"rounded-md"}
                    />
                  )}

                  <input
                    type="file"
                    className=" opacity-0 scale-0"
                    onChange={(e) => {
                      setPhoto(e.target.files[0]);
                    }}
                    id="profile"
                  />
                  <label
                    htmlFor="profile"
                    className={` ${
                      photo ? "opacity-40 hover:opacity-100 " : ""
                    }  cursor-pointer absolute left-0 z-10 flex-col w-full bottom-0 flex items-center justify-center  hover:bg-gray-50 dark:bg-gray-500 dark:hover:bg-gray-600`}
                  >
                    <IoIosCamera className="text-xl " />
                    <span className="text-[10px]">Student Profile</span>
                  </label>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-2 gap-8 lg:gap-5  w-full h-max">
                  <div className="relative">
                    <div className="inputBox">
                      <input
                        required
                        type={"number"}
                        className={`formControl`}
                        onChange={(e) => {
                          setAdmDevice((prev) => {
                            return {
                              ...prev,
                              admissionNo: Number(e.target.value),
                            };
                          });
                        }}
                        value={admDevice.admissionNo}
                      />
                      <label htmlFor={"id"}>
                        Admission No. <span className="text-red-600"> *</span>
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="inputBox">
                      <input
                        required
                        type={"textarea"}
                        className={`formControl `}
                        onChange={(e) => {
                          setAdmDevice((prev) => {
                            return {
                              ...prev,
                              deviceId: Number(e.target.value),
                            };
                          });
                        }}
                        value={admDevice.deviceId}
                      />
                      <label htmlFor={"id"}>
                        Device Id <span className="text-red-600"> *</span>
                      </label>
                    </div>
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
                  <div className="inputBox ">
                    <input
                      required
                      type={"date"}
                      className={`formControl `}
                      {...register("admissionDate")}
                    />
                    <label htmlFor={"id"}>
                      Admission Date <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  <div className="inputBox ">
                    <input
                      required
                      type={"text"}
                      className={`formControl `}
                      {...register("studentName")}
                    />
                    <label htmlFor={"id"}>
                      Student Name <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  <div className="inputBox ">
                    <input
                      required
                      type={"text"}
                      className={`formControl `}
                      {...register("fathersName")}
                    />
                    <label htmlFor={"id"}>
                      {"Father's"} Name <span className="text-red-600"> *</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-2 gap-8 lg:gap-5  pt-4">
                <div className="inputBox ">
                  <input
                    type={"text"}
                    className={`formControl notRequired`}
                    {...register("mothersName")}
                    onFocus={notRequiredInput}
                    onBlurCapture={inputBlur}
                  />
                  <label
                    htmlFor={"id"}
                    className={`${defaultValues.mother && "editLabel"}`}
                  >
                    {"Mother's"} Name
                  </label>
                </div>
                <div className="div">
                  <div className="inputBox">
                    <input
                      required
                      type={"number"}
                      className={`formControl `}
                      {...register("contact", {
                        required: true,
                        minLength: 10,
                        maxLength: 10,
                      })}
                    />
                    <label htmlFor={"id"}>
                      Mobile Number <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  {errors && errors.contact && (
                    <p className="inputWarning ">
                      Please enter a valid 10 digit mobile number.
                    </p>
                  )}
                </div>
                <div className="inputBox">
                  <input
                    type={"number"}
                    className={`formControl notRequired`}
                    {...register("alternateContact")}
                    onFocus={notRequiredInput}
                    onBlurCapture={inputBlur}
                  />
                  <label
                    htmlFor={"id"}
                    className={`${defaultValues.altNo && "editLabel"}`}
                  >
                    Alternate Number
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    type={"email"}
                    className={`formControl notRequired`}
                    {...register("email")}
                    onFocus={notRequiredInput}
                    onBlurCapture={inputBlur}
                  />
                  <label
                    htmlFor={"id"}
                    className={`${defaultValues.email && "editLabel"}`}
                  >
                    Email Address
                  </label>
                </div>

                <div className="inputBox col-span-2 sm:col-span-2">
                  <input
                    required
                    type={"textarea"}
                    className={`formControl `}
                    {...register("address")}
                  />
                  <label htmlFor={"id"}>
                    Address <span className="text-red-600"> *</span>
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
              {/* <div className="grid grid-cols-3 sm:grid-cols-2 gap-8 lg:gap-5  pt-1">
                <div className="relative">
                  <div className="inputBox">
                    <input
                      required
                      type={"number"}
                      className={`formControl `}
                      value={admDevice.admissionNo}
                    />
                    <label htmlFor={"id"}>
                      Admission No. <span className="text-red-600"> *</span>
                    </label>
                  </div>
                </div>

                <div className="inputBox ">
                  <input
                    required
                    type={"date"}
                    className={`formControl `}
                    {...register("admissionDate")}
                  />
                  <label htmlFor={"id"}>
                    Admission Date <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("studentName")}
                  />
                  <label htmlFor={"id"}>
                    Student Name <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("fathersName")}
                  />
                  <label htmlFor={"id"}>
                    {"Father's"} Name <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox ">
                  <input
                    type={"text"}
                    className={`formControl notRequired`}
                    {...register("mothersName")}
                    onFocus={notRequiredInput}
                    onBlurCapture={inputBlur}
                  />
                  <label htmlFor={"id"}>{"Mother's"} Name</label>
                </div>
                <div className="div">
                  <div className="inputBox">
                    <input
                      required
                      type={"number"}
                      className={`formControl `}
                      {...register("contact", {
                        required: true,
                        minLength: 10,
                        maxLength: 10,
                      })}
                    />
                    <label htmlFor={"id"}>
                      Mobile Number <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  {errors && errors.contact && (
                    <p className="inputWarning ">
                      Please enter a valid 10 digit mobile number.
                    </p>
                  )}
                </div>
                <div className="inputBox">
                  <input
                    type={"number"}
                    className={`formControl notRequired`}
                    {...register("alternateContact")}
                    onFocus={notRequiredInput}
                    onBlurCapture={inputBlur}
                  />
                  <label htmlFor={"id"}>Alternate Number</label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type={"email"}
                    className={`formControl `}
                    {...register("email")}
                  />
                  <label htmlFor={"id"}>
                    Email Address <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div>
                  <div>
                    <div className="inputBox">
                      <input
                        required
                        type={"text"}
                        className={`formControl `}
                        {...register("deviceId")}
                      />
                      <label htmlFor={"id"}>
                        Device Id <span className="text-red-600"> *</span>
                      </label>
                    </div>
                  </div>
                </div>
                <div className="inputBox col-span-3 sm:col-span-2">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("address")}
                  />
                  <label htmlFor={"id"}>
                    Address <span className="text-red-600"> *</span>
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
              </div> */}

              <button
                disabled={isLoading}
                className={` btn ms-auto btn-primary mt-4`}
              >
                {isLoading ? <LoaderSpiner hw={18} /> : "Update"}
              </button>
            </form>
          </>
        }
      />

      <CustomModal
        isHeader={false}
        open={modal}
        setOpen={setModal}
        onConfirm={handleDeleteStudent}
        loading={isLoading}
        body={
          <>
            <ConfirmModal />
          </>
        }
      />
      <CustomModal
        isHeader={false}
        open={deactiveModal}
        setOpen={setDeactiveModal}
        onConfirm={handleDeactive}
        loading={isLoading}
        body={
          <>
            <ConfirmModal
              message={"Are Your sure , You want to deactivate student ?"}
            />
          </>
        }
      />
    </>
  );
}
