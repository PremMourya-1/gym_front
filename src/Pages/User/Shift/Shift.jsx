import { useEffect, useState } from "react";
import UseFilter from "../../../Hooks/UseFilter";
import getShiftData, { addEditShift, deleteShift } from "./shiftService";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import { LuPlus } from "react-icons/lu";
import { useForm } from "react-hook-form";
import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import ShiftTable from "./ShiftTable";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import UseShortKey from "../../../Hooks/UseShortKey";
import Tippy from "@tippyjs/react";
function Shift() {
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const [absentMessage, seAbsentMessage] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    // formState: { errors },
  } = useForm();

  const [shiftList, setShiftList] = useState();

  const shiftStoreData = useSelector((state) => state.shift);

  useEffect(() => {
    reset();
    !shiftStoreData ? getShiftData(dispatch) : setShiftList(shiftStoreData);
  }, [shiftStoreData]);

  function handleAddEditShift(data) {
    const payload = {
      ...data,
      presentMessage: Number(data.presentMessage),
      absentMessage,
    };
    !absentMessage && delete payload.absentMessageTime;

    // console.log(payload);
    // return;
    addEditShift(isEditing, listId, payload, setIsLoading, setDrawer, dispatch);
  }
  function handleDeleteShift() {
    deleteShift(listId, setIsLoading, setModal, dispatch);
  }

  function onEditClick(row) {
    const startTime = row.startTime.split(" ")[0];
    const startTimeAm = row.startTime.split(" ")[1];
    // const updatedStartTime =
    //   startTimeAm === "PM"
    //     ? `${Number(startTime.split(":")[0]) + 12}:${startTime.split(":")[1]}`
    //     : startTime;
    let updateStartTime;
    if (startTimeAm === "PM") {
      updateStartTime = `${
        Number(startTime.split(":")[0]) < 12
          ? Number(startTime.split(":")[0]) + 12
          : Number(startTime.split(":")[0])
      }:${startTime.split(":")[1]}`;
    } else {
      updateStartTime = `${
        Number(startTime.split(":")[0]) === 12
          ? "00"
          : Number(startTime.split(":")[0])
      }:${startTime.split(":")[1]}`;
    }

    const endTime = row.endTime.split(" ")[0];
    const endTimeAm = row.endTime.split(" ")[1];

    let updatedEndTime;
    if (endTimeAm === "PM") {
      updatedEndTime = `${
        Number(endTime.split(":")[0]) < 12
          ? Number(endTime.split(":")[0]) + 12
          : Number(endTime.split(":")[0])
      }:${endTime.split(":")[1]}`;
    } else {
      updatedEndTime = `${
        Number(endTime.split(":")[0]) === 12
          ? "00"
          : Number(endTime.split(":")[0])
      }:${endTime.split(":")[1]}`;
    }
    setListId(row.id);
    setIsEditing(true);
    setValue("name", row.name);
    setValue("startTime", updateStartTime);
    setValue("endTime", updatedEndTime);
    setValue("absentMessageTime", row.absentMessageTime);

    setDrawer(true);
  }
  function onDeleteClick(id) {
    setModal(true);
    setListId(id);
  }
  const { query, setQuery, filteredData } = UseFilter(shiftList, "name");
  UseShortKey(setDrawer);

  return (
    <>
      <div className="p-4 card flex items-center justify-between gap-6 mb-3 lg:items-start lg:flex-col">
        <BreadCrumb />
        <div className="flex gap-6 justify-end lg:justify-between w-full">
          <div className="searchContainer  w-[360px]">
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
                {`Create Shift`}
              </button>
            </Tippy>
          </div>
        </div>
      </div>

      <ShiftTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
      <DrawerComponent
        size={"420px"}
        open={drawer}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} ${"Shift"}`}
        body={
          <>
            <form onSubmit={handleSubmit(handleAddEditShift)}>
              <div className="inputBox mb-5">
                <input
                  type="text"
                  required
                  className="formControl"
                  {...register("name")}
                />

                <label
                  htmlFor={"isActive"}
                  className="text-sm font-medium h-max"
                >
                  Shift Name <span className="text-red-600"> *</span>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="inputBox">
                  <input
                    required
                    type="time"
                    className="formControl"
                    {...register("startTime")}
                  />

                  <label
                    htmlFor={"isActive"}
                    className="text-sm font-medium h-max"
                  >
                    Start Time <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type="time"
                    className="formControl"
                    {...register("endTime")}
                  />

                  <label
                    htmlFor={"isActive"}
                    className="text-sm font-medium h-max"
                  >
                    End Time <span className="text-red-600"> *</span>
                  </label>
                </div>

                <div className="flex items-center gap-2 border-b pb-2.5 border-b-[color:var(--background)]">
                  <input
                    type="checkbox"
                    className="mb-1 "
                    id="presentMessage"
                    {...register("presentMessage")}
                  />

                  <label
                    htmlFor={"presentMessage"}
                    className="text-sm font-medium h-max"
                  >
                    Present Message
                  </label>
                </div>
                <div className="flex items-center gap-2 border-b pb-2.5 border-b-[color:var(--background)]">
                  <input
                    type="checkbox"
                    className="mb-1"
                    id="absentMessage"
                    onChange={(e) => {
                      seAbsentMessage(Number(e.target.checked));
                    }}
                    value={absentMessage}
                  />

                  <label
                    htmlFor={"absentMessage"}
                    className="text-sm font-medium h-max"
                  >
                    Absent Message
                  </label>
                </div>
                {absentMessage > 0 && (
                  <div className="inputBox col-span-full">
                    <input
                      required
                      type="number"
                      className="formControl"
                      {...register("absentMessageTime")}
                    />

                    <label
                      htmlFor={"isActive"}
                      className="text-sm font-medium h-max"
                    >
                      Absent Message Time (min){" "}
                      <span className="text-red-600"> *</span>
                    </label>
                  </div>
                )}
              </div>

              <button
                disabled={isLoading}
                className="btn ms-auto btn-primary mt-4"
              >
                {isLoading ? <LoaderSpiner /> : "Save"}
              </button>
            </form>
          </>
        }
      />
      <CustomModal
        isHeader={false}
        open={modal}
        setOpen={setModal}
        onConfirm={handleDeleteShift}
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

export default Shift;
