import { useForm } from "react-hook-form";
import { IoIosAdd } from "react-icons/io";
import DrawerComponent from "../../../../Components/Drawer/Drawer";
import LoaderSpiner from "../../../../Components/Loaders/LoaderSpiner";
import { useContext, useEffect, useState } from "react";
import getSmsData, { addEditSms } from "./smsService";
import SmsTable from "./SmsTable";
import { LoaderContext } from "../../../../Context/LoaderContext";
import BreadCrumb from "../../../../Components/Common/BreadCrumb/BreadCrumb";
function SmsSetting() {
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [smsList, setSmsList] = useState([]);
  const [isSms, setIsSms] = useState(0);
  const { setTpLoader } = useContext(LoaderContext);
  const {
    register,
    handleSubmit,
    // reset,
    setValue,
    // formState: { errors },
  } = useForm();

  useEffect(() => {
    getSmsData(setSmsList);
  }, []);

  function handleAddSms(data) {
    addEditSms({ isSms, ...data }, setIsLoading, setDrawer, setSmsList);
  }

  function onEditClick(row) {
    setValue("url", row.url);
    setValue("userId", row.userId);
    setValue("instituteName", row.instituteName);
    setValue("password", row.password);
    setValue("senderId", row.senderId);
    setValue("pId", row.pId);
    setIsSms(row.isSms);
    setIsEditing(true);
    setDrawer(true);
  }

  function onStatusChange(e) {
    addEditSms(
      { ...smsList[0], isSms: Number(e) },
      setTpLoader,
      setDrawer,
      setSmsList
    );
  }

  return (
    <>
      <div className="breadCrumbAndSearchBar">
        <BreadCrumb />
      </div>
      <SmsTable
        data={smsList}
        onEditClick={onEditClick}
        onStatusChange={onStatusChange}
      />
      <DrawerComponent
        size={"550px"}
        open={drawer}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} ${"Sms"}`}
        body={
          <>
            <form onSubmit={handleSubmit(handleAddSms)}>
              <div className=" grid grid-cols-2  gap-8 lg:gap-5">
                <div className="inputBox col-span-2">
                  <input
                    required
                    type={"text"}
                    autoFocus
                    className={`formControl `}
                    {...register("url")}
                  />
                  <label htmlFor={"id"}>
                    Url <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type={"number"}
                    className={`formControl`}
                    {...register("userId")}
                  />
                  <label className="pr-5" htmlFor={"id"}>
                    User Id <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("senderId")}
                  />
                  <label className="pr-5" htmlFor={"id"}>
                    sender Id <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("pId")}
                  />
                  <label className="pr-5" htmlFor={"id"}>
                    P Id <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("password")}
                  />
                  <label className="pr-5" htmlFor={"id"}>
                    Password <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("instituteName")}
                  />
                  <label className="pr-5" htmlFor={"id"}>
                    Institute Name <span className="text-red-600"> *</span>
                  </label>
                </div>
              </div>

              <button
                disabled={isLoading}
                className="btn ms-auto btn-primary mt-4"
              >
                {isLoading ? <LoaderSpiner /> : isEditing ? "Update" : "Save"}
              </button>
            </form>
          </>
        }
      />

      {!smsList.length && (
        <button
          onClick={() => {
            setDrawer(true);
          }}
          className="fixed z-30 bottom-24 right-10 bg-[color:var(--background)] w-12 h-12 hover:shadow-xl text-white rounded-full flex items-center justify-center"
        >
          <IoIosAdd className="text-2xl" />
        </button>
      )}
    </>
  );
}

export default SmsSetting;
