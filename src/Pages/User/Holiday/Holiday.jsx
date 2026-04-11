import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";
import HolidayTable from "./HolidayTable";
import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import getHolidayData, {
  addAndEditHoliday,
  deleteHoliday,
} from "./holidayService";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import moment from "moment";
import UseFilter from "../../../Hooks/UseFilter";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import Tippy from "@tippyjs/react";
import UseShortKey from "../../../Hooks/UseShortKey";

function Holiday() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);
  const [holidayDays, setHolidayDays] = useState(null);

  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [listId, setListId] = useState(0);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    // formState: { errors },
  } = useForm();

  const holidayStoreData = useSelector((state) => state.holiday);
  const [holiDayList, setHolidayList] = useState();

  useEffect(() => {
    reset();
    !holidayStoreData
      ? getHolidayData({ sessionMasterId }, dispatch)
      : setHolidayList(holidayStoreData);
  }, [holidayStoreData]);

  function handleAddEditHoliday(data) {
    const payload = { ...data, sessionMasterId };
    addAndEditHoliday(
      isEditing,
      listId,
      payload,
      setIsLoading,
      setDrawer,
      dispatch
    );
  }
  function handleDeleteHoliday() {
    deleteHoliday(
      { sessionMasterId, id: listId },
      setIsLoading,
      setModal,
      dispatch
    );
  }

  function onEditClick(row) {
    setListId(row.id);
    setIsEditing(true);
    setValue("title", row.title);
    setValue("startDate", moment(row.startDate).format("YYYY-MM-DD"));
    setValue("endDate", moment(row.endDate).format("YYYY-MM-DD"));
    setDrawer(true);
  }
  function onDeleteClick(id) {
    setModal(true);
    setListId(id);
  }
  UseShortKey(setDrawer);

  const { query, setQuery, filteredData } = UseFilter(holiDayList, "title");
  useEffect(() => {
    const subscription = watch((value) => {
      const diff = new Date(value.endDate) - new Date(value.startDate);
      const differenceInDays = diff / (1000 * 60 * 60 * 24);
      setHolidayDays(differenceInDays);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

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
                {`Create Holiday`}
              </button>
            </Tippy>
          </div>
        </div>
      </div>

      <HolidayTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />

      <DrawerComponent
        open={drawer}
        size={"550px"}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} Holiday`}
        body={
          <>
            <form onSubmit={handleSubmit(handleAddEditHoliday)}>
              <div className=" grid grid-cols-2  gap-8 lg:gap-5">
                <div className="inputBox col-span-2">
                  <input
                    required
                    type={"text"}
                    autoFocus
                    className={`formControl `}
                    {...register("title")}
                  />
                  <label htmlFor={"id"}>
                    Holiday Title <span className="text-red-600"> *</span>
                  </label>
                </div>

                <div className="inputBox ">
                  <input
                    required
                    type={"date"}
                    className={`formControl `}
                    {...register("startDate")}
                  />
                  <label className="pr-5" htmlFor={"id"}>
                    Start Date <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox ">
                  <input
                    required
                    type={"date"}
                    className={`formControl `}
                    {...register("endDate")}
                  />
                  <label className="pr-5" htmlFor={"id"}>
                    End Date <span className="text-red-600"> *</span>
                  </label>
                </div>
                {holidayDays >= 0 && (
                  <h5>
                    {holidayDays + 1} {holidayDays > 0 ? "Days" : "Day"}
                  </h5>
                )}
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
        onConfirm={handleDeleteHoliday}
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

export default Holiday;
