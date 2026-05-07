import { useEffect, useState } from "react";
import CustomModal from "../../../Components/Modal/Modal";
import GymTable from "./GymTable";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import createAndGym, { deleteGym, getGymData } from "./gymService";
import { useForm } from "react-hook-form";
import LoaderSpiner from "../../../Components/Common/Loader/LoaderSpiner";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import UseFilter from "../../../Hooks/UseFilter";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import UseShortKey from "../../../Hooks/UseShortKey";
import Button from "../../../Components/Button/Button";
import { getPlanData } from "../Plan/planServices";

function Gym() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [gymList, setGymList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [planList, setPlanList] = useState();

  useEffect(() => {
    getPlanData(setPlanList);
    getGymData(setGymList);
  }, []);

  const { register, handleSubmit, setValue } = useForm();

  function handleForm(data) {
    createAndGym(data, listId, setDrawer, setGymList, setIsLoading);
  }

  function onEditClick(row) {
    console.log(row);
    setListId(row.id);
    setIsEditing(true);

    setValue("gymName", row.gymName);
    setValue("ownerName", row.ownerName);
    setValue("email", row.email);
    setValue("phone", row.phone);
    setValue("address", row.address);
    setValue("city", row.city);
    setValue("state", row.state);
    setValue("planId", row.planId);
    setValue("planStartDate", row.planStartDate);
    setValue("planEndDate", row.planEndDate);
    setValue("username", row.username);

    setDrawer(true);
  }

  function onDeleteClick(id) {
    console.log(id);
    setListId(id);
    setModal(true);
  }

  function handleDeleteGym() {
    deleteGym(listId, setIsLoading, setGymList, setModal);
  }

  UseShortKey(setDrawer);
  const { filteredData } = UseFilter(gymList, "gymName");

  return (
    <>
      <div className="flex justify-between">
        <BreadCrumb />
        <Button onClick={() => setDrawer(true)}>Add new gym</Button>
      </div>

      <GymTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />

      <CustomModal
        isHeader={false}
        open={modal}
        setOpen={setModal}
        onConfirm={handleDeleteGym}
        loading={isLoading}
        body={<ConfirmModal />}
      />

      <DrawerComponent
        size={"420px"}
        open={drawer}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} Gym`}
        body={
          <form onSubmit={handleSubmit(handleForm)}>
            <div className="grid grid-cols-1 gap-4 lg:gap-5">
              <div className="inputBox">
                <input
                  required
                  type="text"
                  className="formControl"
                  {...register("gymName")}
                />
                <label>
                  Gym Name <span className="text-red-600">*</span>
                </label>
              </div>

              <div className="inputBox">
                <input
                  type="text"
                  className="formControl"
                  {...register("ownerName")}
                />
                <label>Owner Name</label>
              </div>

              <div className="inputBox">
                <input
                  required
                  type="email"
                  className="formControl"
                  {...register("email")}
                />
                <label>
                  Email <span className="text-red-600">*</span>
                </label>
              </div>

              <div className="inputBox">
                <input
                  required
                  type="text"
                  className="formControl"
                  {...register("phone")}
                />
                <label>
                  Phone <span className="text-red-600">*</span>
                </label>
              </div>

              <div className="inputBox">
                <input
                  required
                  type="text"
                  className="formControl"
                  {...register("username")}
                />
                <label>
                  Username <span className="text-red-600">*</span>
                </label>
              </div>
              {!listId && (
                <div className="inputBox">
                  <input
                    required
                    type="password"
                    className="formControl"
                    {...register("password")}
                  />
                  <label>
                    Password <span className="text-red-600">*</span>
                  </label>
                </div>
              )}

              <div className="inputBox">
                <input
                  type="text"
                  className="formControl"
                  {...register("address")}
                />
                <label>Address</label>
              </div>

              <div className="inputBox">
                <input
                  type="text"
                  className="formControl"
                  {...register("city")}
                />
                <label>City</label>
              </div>

              <div className="inputBox">
                <input
                  type="text"
                  className="formControl"
                  {...register("state")}
                />
                <label>State</label>
              </div>

              <div className="inputBox">
                <select
                  className="formControl"
                  {...register("planId")}
                  required
                >
                  {planList?.map((item) => {
                    return (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>

                <label>Plan Id</label>
              </div>

              <div className="inputBox">
                <input
                  type="date"
                  className="formControl"
                  {...register("planStartDate")}
                />
                <label>Plan Start Date</label>
              </div>
            </div>

            <button
              disabled={isLoading}
              className="btn ms-auto btn-primary mt-7"
            >
              {isLoading ? <LoaderSpiner /> : "Save"}
            </button>
          </form>
        }
      />
    </>
  );
}

export default Gym;
