import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import getMasterData, {
  addAndEditMaster,
  deleteMaster,
} from "../Master/masterService";
import SessionTable from "./SessionTable";
import LoaderSpiner from "../../../Components/Common/Loader/LoaderSpiner";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import { LuPlus } from "react-icons/lu";
// import { Checkbox } from "rsuite";
import moment from "moment";
import { LoaderContext } from "../../../Context/LoaderContext";
import { updateAuthDataForSession } from "../../../Store/Slices/AuthSlice";
import {
  getLocaleStorageItem,
  setLocaleStorageItem,
} from "../../../Utils/localeStorage";
import { USER_DETAILS } from "../../../Constant/Constant";
import UseFilter from "../../../Hooks/UseFilter";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import UseShortKey from "../../../Hooks/UseShortKey";
import Tippy from "@tippyjs/react";

function Session() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const [isActive, setIsActive] = useState(false);
  const { setTpLoader } = useContext(LoaderContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    // formState: { errors },
  } = useForm();

  const [sessionList, setSessionList] = useState();

  const masterStoreData = useSelector((state) =>
    state.master?.find((it) => it.type === "session")
  );

  useEffect(() => {
    reset();
    !masterStoreData?.data
      ? getMasterData("session", dispatch)
      : setSessionList(masterStoreData.data);
  }, [masterStoreData]);

  function handleAddMaster(data, id) {
    const updatedData = { ...data, isActive: Number(isActive) };

    addAndEditMaster(
      isEditing,
      "session",
      listId || id,
      updatedData,
      setIsLoading,
      setDrawer,
      dispatch
    );
  }

  function onEditClick(row) {
    setListId(row.id);
    setIsEditing(true);
    setValue("sessionName", row.sessionName);
    setValue("startDate", moment(row.startDate).format("YYYY-MM-DD"));
    setValue("endDate", moment(row.endDate).format("YYYY-MM-DD"));
    setIsActive(Boolean(Number(row.isActive)));
    setDrawer(true);
  }
  function onDeleteClick(id) {
    setModal(true);
    setListId(id);
  }
  function handleDeleteMaster() {
    deleteMaster("session", listId, setIsLoading, setModal, dispatch);
  }
  async function onChangeStatus(isActive, id) {
    setTpLoader(true);
    const res = await addAndEditMaster(
      true, // isEdiging
      "session",
      id,
      { isActive: Number(isActive) },
      setIsLoading,
      setDrawer,
      dispatch
    );
    setTpLoader(false);
    if (res.data.action) {
      dispatch(
        updateAuthDataForSession({
          sessionMasterId: res.data.data.id,
        })
      );

      setLocaleStorageItem(USER_DETAILS, {
        ...getLocaleStorageItem(USER_DETAILS),
        sessionData: res.data.data,
      });
      // window.location.href = "/";
    }
  }
  const { query, setQuery, filteredData } = UseFilter(
    sessionList,
    "sessionName"
  );
  UseShortKey(setDrawer);
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
                {`Create Session`}
              </button>
            </Tippy>
          </div>
        </div>
      </div>
      {/* <div className="p-4 card flex justify-between gap-6 mb-3 md:flex-col md:gap-4">
        <div className="searchContainer w-full">
          <div className="inputBox w-full max-w-[360px] md:max-w-full">
            <input
              required
              type={"text"}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              value={query}
              className={`formControl `}
            />
            <label htmlFor={"id"}>Search</label>
          </div>
        </div>
        <div className="buttons shrink-0"></div>
      </div> */}
      <SessionTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        onChangeStatus={onChangeStatus}
      />

      <DrawerComponent
        size={"550px"}
        open={drawer}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} ${"Session"}`}
        body={
          <>
            <form onSubmit={handleSubmit(handleAddMaster)}>
              <div className="grid grid-cols-2  gap-8 lg:gap-5">
                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    autoFocus
                    className={`formControl `}
                    {...register("sessionName")}
                  />
                  <label htmlFor={"id"}>
                    Session <span className="text-red-600"> *</span>
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
        onConfirm={handleDeleteMaster}
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

export default Session;
