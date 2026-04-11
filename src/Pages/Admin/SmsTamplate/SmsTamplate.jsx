import { LuPlus } from "react-icons/lu";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import getSmsTamplateData, {
  addEditTamplate,
  deleteTamplate,
} from "./tamplateService";
import { useForm } from "react-hook-form";
import "react-multi-date-picker/styles/colors/green.css";
import Tippy from "@tippyjs/react";
import UseFilter from "../../../Hooks/UseFilter";
import UseShortKey from "../../../Hooks/UseShortKey";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import { LoaderContext } from "../../../Context/LoaderContext";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import TamplateTable from "./TamplateTable";

function SmsTamplate() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState(0);
  const { setTpLoader } = useContext(LoaderContext);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    // formState: { errors },
  } = useForm();
  const [tamplateList, setTamplateList] = useState();

  const tamplateStoreData = useSelector((state) => state.tamplate);

  useEffect(() => {
    reset();
    !tamplateStoreData
      ? getSmsTamplateData(dispatch)
      : setTamplateList(tamplateStoreData);
  }, [tamplateStoreData]);

  function handleAddTamplate(data, id) {
    const updatedData = { ...data, status };

    addEditTamplate(
      isEditing,
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
    setDrawer(true);
    setValue("messageType", row.messageType);
    setValue("message", row.message);
    setValue("variable", row.variable);
    setValue("templateId", row.templateId);
    setStatus(row.status);
  }
  function onChangeStatus(e, id) {
    addEditTamplate(
      true,
      id,
      { status: Number(e) },
      setTpLoader,
      setDrawer,
      dispatch
    );
  }

  function onDeleteClick(id) {
    setModal(true);
    setListId(id);
  }

  function handleDeleteTamplate() {
    deleteTamplate(listId, setIsLoading, setModal, dispatch);
  }
  const { query, setQuery, filteredData } = UseFilter(tamplateList, "message");
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
                {`Create Tamplate`}
              </button>
            </Tippy>
          </div>
        </div>
      </div>
      <TamplateTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        onChangeStatus={onChangeStatus}
      />
      <DrawerComponent
        size={"550px"}
        open={drawer}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} ${"Tamplate"}`}
        body={
          <>
            <form onSubmit={handleSubmit(handleAddTamplate)}>
              <div className=" grid grid-cols-2  gap-8 lg:gap-5">
                <div className="inputBox">
                  <select
                    className="formControl"
                    required
                    {...register("messageType")}
                  >
                    <option value="" hidden>
                      --Select --
                    </option>
                    <option value="a">A</option>
                    <option value="b">B</option>
                  </select>
                  <label htmlFor={"id"}>
                    Message type <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("variable")}
                  />
                  <label className="pr-5" htmlFor={"id"}>
                    Variable <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type={"number"}
                    className={`formControl `}
                    {...register("templateId")}
                  />
                  <label className="pr-5" htmlFor={"id"}>
                    Tamplate Id <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="border-b border-blue-800 flex gap-1 items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    onChange={(e) => {
                      setStatus(Number(e.target.checked));
                    }}
                    checked={status}
                    className="h-3 w-3"
                  />
                  <label htmlFor={"isActive"} className="text-sm font-medium">
                    Is Active
                  </label>
                </div>
                <div className="inputBox col-span-2">
                  <textarea
                    name=""
                    required
                    id=""
                    className="formControl "
                    {...register("message")}
                  ></textarea>
                  <label
                    htmlFor={"isActive"}
                    className="text-sm font-medium h-max"
                  >
                    Message
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
        onConfirm={handleDeleteTamplate}
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

export default SmsTamplate;
