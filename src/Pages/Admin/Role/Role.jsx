import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import getRoleData, { addEditRole, deleteRole } from "./roleService";
import RoleTable from "./RoleTable";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import UseFilter from "../../../Hooks/UseFilter";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import Tippy from "@tippyjs/react";
import UseShortKey from "../../../Hooks/UseShortKey";

function Role() {
  const [isEditing, setIsEditing] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roleList, setRoleList] = useState();
  const [permissionData, setPermissionData] = useState([]);
  const [listId, setListId] = useState();
  const [modal, setModal] = useState();
  const [permissionError, setPermissionError] = useState(false);
  const permissions = [
    "all",

    "plans",
    "ticket",
    "role",
    "user",
    "coupon",
    "sms-template",
  ];
  useEffect(() => {
    permissionData.length && setPermissionError(false);
  }, [permissionData]);

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

  function handleAddEditRole(data) {
    if (permissionData.length) {
      addEditRole(
        isEditing,
        listId,
        { permission: permissionData, ...data },
        setIsLoading,
        setDrawer,
        setRoleList
      );
    } else setPermissionError(true);
  }
  function handleDeleteRole() {
    deleteRole(listId, setIsLoading, setModal, setRoleList);
  }
  function onEditClick(row) {
    setValue("role", row.role);
    setPermissionData(row.permission);
    setIsEditing(true);
    setListId(row.id);
    setDrawer(true);
  }
  function onDeleteClick(id) {
    setModal(true);
    setListId(id);
  }
  UseShortKey(setDrawer);

  const { query, setQuery, filteredData } = UseFilter(roleList, "role");

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
        size={"420px"}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} Role`}
        body={
          <>
            <form onSubmit={handleSubmit(handleAddEditRole)}>
              <div className=" grid grid-cols-1  gap-8 lg:gap-5">
                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    autoFocus
                    className={`formControl `}
                    {...register("role")}
                  />
                  <label htmlFor={"id"}>
                    Role <span className="text-red-600"> *</span>
                  </label>
                </div>

                <div className="flexContainer flex flex-wrap gap-4">
                  {permissions.map((item, i) => {
                    if (
                      item === "all" ||
                      !permissionData.find((it) => it === "all")
                    ) {
                      return (
                        <div
                          key={i + 1}
                          className="box flex gap-2 items-center"
                        >
                          <input
                            id={item}
                            type={"checkbox"}
                            autoFocus
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPermissionData((prev) => {
                                  return [...prev, item];
                                });
                              } else {
                                setPermissionData((prev) => {
                                  return prev.filter((it) => it !== item);
                                });
                              }
                            }}
                            checked={permissionData.find((it) => it === item)}
                          />
                          <label
                            htmlFor={item}
                            className={`${
                              permissionData.find((it) => it === item)
                                ? "text-green-500"
                                : ""
                            } text-sm capitalize`}
                          >
                            {item}
                          </label>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              {permissionError && (
                <p className="inputWarning font-medium mt-2">
                  Please Select atleast 1 permission
                </p>
              )}
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

      <RoleTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
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

export default Role;
