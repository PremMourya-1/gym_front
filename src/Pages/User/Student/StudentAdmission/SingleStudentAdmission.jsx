import { useForm } from "react-hook-form";
import DrawerComponent from "../../../../Components/Drawer/Drawer";
import { addAndEditStudent } from "../StudentLIst/studentService";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import LoaderSpiner from "../../../../Components/Loaders/LoaderSpiner";
import notRequiredInput, { inputBlur } from "../../../../Utils/notRequired";
import { useNavigate } from "react-router";
import getShiftData from "../../Shift/shiftService";
import Image from "../../../../Components/Common/Image/Image";
import { IoIosCamera } from "react-icons/io";
import moment from "moment";

function SingleStudentAdmission({ open, setOpen, masterData, oldData }) {
  const navigate = useNavigate();
  const sessionMasterId = useSelector((state) => state.auth?.sessionData.id);
  const [admDevice, setAdmDevice] = useState({});
  const [exist, setExist] = useState({ admissionNo: false, deviceId: false });
  const [photo, setPhoto] = useState(null);
  const [imageSizeError, setImageSizeError] = useState(false);

  useEffect(() => {
    photo?.size > 100000 ? setImageSizeError(true) : setImageSizeError(false);
  }, [photo]);
  const currentSessionDate = useSelector((state) => state.auth?.sessionData);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const [shiftList, setShiftList] = useState();

  const shiftStoreData = useSelector((state) => state.shift);

  useEffect(() => {
    reset();
    !shiftStoreData ? getShiftData(dispatch) : setShiftList(shiftStoreData);
  }, [shiftStoreData]);

  function handleSingleStudentAdmission(data) {
    const payload = { ...data, sessionMasterId, ...admDevice, photo };
    !payload.photo && delete payload.photo;

    addAndEditStudent({
      payload,
      setIsLoading,
      setOpen,
      dispatch,
      reset,
      navigate,
    });
  }

  useEffect(() => {
    if (admDevice.admissionNo) {
      const admissionNo = oldData?.some((it) => {
        return it.admissionNo === Number(admDevice.admissionNo);
      });
      setExist((prev) => {
        return { ...prev, admissionNo };
      });
    }
    if (admDevice.deviceId) {
      const deviceId = oldData?.some(
        (it) => Number(it.deviceId) === Number(admDevice.deviceId)
      );
      setExist((prev) => {
        return { ...prev, deviceId };
      });
    }
  }, [admDevice]);

  useEffect(() => {
    setAdmDevice((prev) => {
      return { ...prev, admissionNo: oldData?.find((it) => it.max)?.max + 1 };
    });
  }, [oldData]);

  useEffect(() => {
    setValue("admissionDate", moment(new Date()).format("YYYY-MM-DD"));
  }, [open]);

  return (
    <>
      <DrawerComponent
        size={"900px"}
        setOpen={setOpen}
        open={open}
        title={"Student Admission"}
        body={
          <>
            <form onSubmit={handleSubmit(handleSingleStudentAdmission)}>
              <div className="flex gap-8 sm:flex-col">
                <div className="relative  studentProfilePicture  h-28 w-28 shrink-0 rounded-md border  dark:border-gray-500">
                  {photo && (
                    <Image
                      dynamic={false}
                      url={photo && URL.createObjectURL(photo)}
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
                      photo ? "opacity-40 hover:opacity-100 bg-gray-100" : ""
                    }  cursor-pointer bg-gray-50 hover:bg-gray-100 absolute left-0 z-10 flex-col w-full bottom-0 flex items-center justify-center  dark:bg-gray-500 dark:hover:bg-gray-600`}
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
                    {exist.admissionNo && (
                      <p className="inputWarning">
                        Admission no. is already exist
                      </p>
                    )}
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
                    {exist.deviceId && (
                      <p className="inputWarning">Device Id is already exist</p>
                    )}
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
                  <div className="inputBox">
                    <input
                      required
                      type={"date"}
                      className={`formControl `}
                      {...register("admissionDate")}
                      min={moment(currentSessionDate?.startDate).format(
                        "YYYY-MM-DD"
                      )}
                      max={moment(new Date()).format("YYYY-MM-DD")}
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
                      Primary Mobile No <span className="text-red-600"> *</span>
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
                  <label htmlFor={"id"}>Alternate Mobile No</label>
                </div>
                <div className="inputBox">
                  <input
                    type={"email"}
                    className={`formControl notRequired`}
                    {...register("email")}
                    onFocus={notRequiredInput}
                    onBlurCapture={inputBlur}
                  />
                  <label htmlFor={"id"}>Email Address</label>
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
              <div className="flex justify-end mt-4 items-center gap-2">
                {imageSizeError ? (
                  <span className="text-sm text-red-600 dark:text-red-500">
                    The uploaded image is too large. Please select an image
                    smaller than 100KB.
                  </span>
                ) : (
                  ""
                )}
                <button
                  disabled={
                    isLoading ||
                    exist.admissionNo ||
                    exist.deviceId ||
                    imageSizeError
                  }
                  className={` ${
                    exist.admissionNo || exist.deviceId || imageSizeError
                      ? "opacity-45 pointer-events-none"
                      : ""
                  } btn  btn-primary`}
                >
                  {isLoading ? <LoaderSpiner hw={18} /> : "Save"}
                </button>
              </div>
            </form>
          </>
        }
      />
    </>
  );
}

export default SingleStudentAdmission;
