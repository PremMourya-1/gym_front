import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import UseFilter from "../../../Hooks/UseFilter";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import CustomModal from "../../../Components/Modal/Modal";
import UserTable from "./UserTable";
import getUserData, { addEditUser, deleteUser } from "./userService";
import getRoleData from "../Role/roleService";
import { LoaderContext } from "../../../Context/LoaderContext";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import UseShortKey from "../../../Hooks/UseShortKey";
import Tippy from "@tippyjs/react";

function User() {
  const [isEditing, setIsEditing] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userList, setUserList] = useState();
  const [roleList, setRoleList] = useState();
  const [listId, setListId] = useState();
  const [modal, setModal] = useState();
  const { setTpLoader } = useContext(LoaderContext);
  const [isShow, setIsShow] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    // formState: { errors },
  } = useForm();

  useEffect(() => {
    getRoleData(setRoleList);
  }, []);
  useEffect(() => {
    getUserData(setUserList);
  }, []);

  function handleAddEditUser(data) {
    addEditUser(
      isEditing,
      listId,
      { ...data, isActive: Number(isActive) },
      setIsLoading,
      setDrawer,
      setUserList
    );
  }
  function handleDeleteRole() {
    deleteUser(listId, setIsLoading, setModal, setUserList);
  }

  function onChangeStatus(isActive, id) {
    addEditUser(
      true, // isEdiging
      id,
      { isActive: Number(isActive) },
      setTpLoader,
      setDrawer,
      setUserList
    );
  }
  function onEditClick(row) {
    reset();
    setValue("fullName", row.fullName);
    setValue("email", row.email);
    setValue("rollMasterId", row.rollMasterId);
    setValue("mobileNo", row.mobileNo);
    setIsActive(Boolean(Number(row.isActive)));
    setIsEditing(true);
    setListId(row.id);
    setDrawer(true);
  }

  function onDeleteClick(id) {
    setModal(true);
    setListId(id);
  }
  UseShortKey(setDrawer);
  const { query, setQuery, filteredData } = UseFilter(userList, "fullName");

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
                {`Create Role`}
              </button>
            </Tippy>
          </div>
        </div>
      </div>
      <DrawerComponent
        open={drawer}
        size={"520px"}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} User`}
        body={
          <>
            <form onSubmit={handleSubmit(handleAddEditUser)}>
              <div className=" grid grid-cols-2  gap-8 lg:gap-5">
                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    autoFocus
                    className={`formControl `}
                    {...register("fullName")}
                  />
                  <label htmlFor={"id"}>
                    user Name <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("mobileNo")}
                    id="mobile"
                  />
                  <label htmlFor={"mobile"}>
                    Mobile no <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("email")}
                    id="email"
                  />
                  <label htmlFor={"email"}>
                    Email Address <span className="text-red-600"> *</span>
                  </label>
                </div>
                {!isEditing && (
                  <div className="inputBox">
                    <input
                      required
                      id={"password"}
                      type={isShow ? "text" : "password"}
                      className={`formControl  `}
                      {...register("password")}
                    />
                    <label htmlFor={"password"}>
                      Password
                      <span className="text-red-600"> *</span>
                    </label>

                    <div
                      onClick={() => {
                        setIsShow(!isShow);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                      {isShow ? <VscEye /> : <VscEyeClosed />}
                    </div>
                  </div>
                )}
                <div className="inputBox ">
                  <select
                    required
                    name=""
                    id=""
                    className="formControl"
                    {...register("rollMasterId")}
                  >
                    <option value="" hidden>
                      --select--
                    </option>
                    {roleList?.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.role}
                      </option>
                    ))}
                  </select>
                  <label htmlFor={"id"}>
                    Select Role <span className="text-red-600"> *</span>
                  </label>
                </div>
                {/* <div className="border-b border-blue-800 flex gap-1 items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    onChange={(e) => {
                      setIsActive(e.target.checked);
                    }}
                    checked={isActive}
                    className="h-3 w-3"
                  />
                  <label htmlFor={"isActive"} className="text-sm font-medium">
                    Active
                  </label>
                </div> */}
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
      <UserTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        onChangeStatus={onChangeStatus}
      />
      <CustomModal
        isHeader={false}
        open={modal}
        setOpen={setModal}
        onConfirm={handleDeleteRole}
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

export default User;
