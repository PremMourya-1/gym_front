import { useEffect, useState } from "react";
import UseFilter from "../../../Hooks/UseFilter";
import getDeviceData, { addEditDevice, deleteDevice } from "./deviceService";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import { LuPlus } from "react-icons/lu";
import { useForm } from "react-hook-form";
import DeviceTable from "./DeviceTable";
import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import UseShortKey from "../../../Hooks/UseShortKey";
import Tippy from "@tippyjs/react";

function Device() {
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deviceList, setDeviceList] = useState();
  const [modal, setModal] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    // formState: { errors },
  } = useForm();

  useEffect(() => {
    getDeviceData(setDeviceList);
  }, []);
  function handleAddDevice(data) {
    addEditDevice(
      isEditing,
      listId,
      data,
      setIsLoading,
      setDrawer,
      setDeviceList
    );
  }
  function handleDeleteDevice() {
    deleteDevice(listId, setIsLoading, setModal, setDeviceList);
  }

  function onEditClick(row) {
    setListId(row.id);
    setIsEditing(true);
    setValue("deviceId", row.deviceId);
    setValue("deviceName", row.deviceName);

    setDrawer(true);
  }
  function onDeleteClick(id) {
    setModal(true);
    setListId(id);
  }
  UseShortKey(setDrawer);
  const { query, setQuery, filteredData } = UseFilter(deviceList, "deviceName");

  return (
    <>
      <div className="breadCrumbAndSearchBar">
        <BreadCrumb />
        <div className="searchAndButton">
          <div className="searchContainer">
            <div className="inputBox w-full">
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
          <div className="buttons shrink-0">
            <Tippy content="Ctrl + M" placement="bottom">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setDrawer(true);
                  reset();
                }}
                className={`btn group  btn-primary md:w-full`}
              >
                <LuPlus className="h-4 w-4 group-hover:fill-white transition-none" />
                {`Create Device`}
              </button>
            </Tippy>
          </div>
        </div>
      </div>

      <DeviceTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
      <DrawerComponent
        size={"420px"}
        open={drawer}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} ${"Device"}`}
        body={
          <>
            <form onSubmit={handleSubmit(handleAddDevice)}>
              <div className=" grid grid-cols-2  gap-8 lg:gap-5">
                <div className="inputBox col-span-2">
                  <input
                    type="text"
                    required
                    className="formControl"
                    {...register("deviceName")}
                  />

                  <label
                    htmlFor={"isActive"}
                    className="text-sm font-medium h-max"
                  >
                    Device Name <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox col-span-2">
                  <input
                    required
                    type="text"
                    className="formControl"
                    {...register("deviceId")}
                  />

                  <label
                    htmlFor={"isActive"}
                    className="text-sm font-medium h-max"
                  >
                    Cloud Id / Serial No.{" "}
                    <span className="text-red-600"> *</span>
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
      <CustomModal
        isHeader={false}
        open={modal}
        setOpen={setModal}
        onConfirm={handleDeleteDevice}
        loading={isLoading}
        body={
          <>
            <ConfirmModal />
          </>
        }
      />
    </>
  );
}

export default Device;
