import { useEffect, useState } from "react";
import { useParams } from "react-router";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import MasterTable from "./MasterTable";
import CustomModal from "../../../Components/Modal/Modal";
import { useDispatch, useSelector } from "react-redux";
import getMasterData, { addAndEditMaster, deleteMaster } from "./masterService";
import LoaderSpiner from "../../../Components/Common/Loader/LoaderSpiner";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import UseFilter from "../../../Hooks/UseFilter";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import SearchBar from "../../../Components/Common/SearchBar/SearchBar";
import UseShortKey from "../../../Hooks/UseShortKey";
import Tippy from "@tippyjs/react";

function Master() {
  const { slug } = useParams();
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState(false);
  const [actionType, setActionType] = useState("ADD");
  const [isLoading, setIsLoading] = useState(false);
  const disptach = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [listId, setListId] = useState(0);

  UseShortKey(setDrawer);

  const { register, handleSubmit, reset, setValue } = useForm();

  const [masterData, setMasterData] = useState();
  const masterStoreData = useSelector((state) =>
    state.master?.find((it) => it.type === slug),
  );

  useEffect(() => {
    reset();
    !masterStoreData?.data
      ? getMasterData(slug, disptach)
      : setMasterData(masterStoreData.data);
  }, [masterStoreData, slug]);

  function handleAddMaster(data) {
    addAndEditMaster(
      isEditing,
      slug,
      listId,
      data,
      setIsLoading,
      setDrawer,
      disptach,
    );
  }

  function onEditClick(row) {
    setActionType();
    setListId(row.id);
    setIsEditing(true);
    setValue("name", row.name);
    setDrawer(true);
  }
  function onDeleteClick(id) {
    setModal(true);
    setListId(id);
  }

  function handleDeleteMaster() {
    deleteMaster(slug, listId, setIsLoading, setModal, disptach);
  }

  const { query, setQuery, filteredData } = UseFilter(masterData, "name");
  return (
    <>
      <div className="breadCrumbAndSearchBar">
        <BreadCrumb />
        <div className="searchAndButton">
          <SearchBar query={query} setQuery={setQuery} />
          <div className="buttons shrink-0">
            <Tippy content="Ctrl + M" placement="bottom">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setActionType("ADD");
                  reset();
                  setDrawer(true);
                }}
                className={`btn group  btn-primary md:w-full`}
              >
                <LuPlus className="h-4 w-4 group-hover:fill-white transition-none" />
                {`Create ${slug}`}
              </button>
            </Tippy>
          </div>
        </div>
      </div>

      <MasterTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />

      <DrawerComponent
        open={drawer}
        setOpen={setDrawer}
        title={`${actionType === "ADD" ? "Add New" : "Update"} ${slug}`}
        body={
          <>
            <form onSubmit={handleSubmit(handleAddMaster)}>
              <div className="inputContainer">
                <div className="inputBox">
                  <input
                    required
                    type={"text"}
                    autoFocus
                    className={`formControl `}
                    {...register("name")}
                  />
                  <label htmlFor={"id"}>
                    {slug} Name <span className="text-red-600"> *</span>
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

export default Master;
