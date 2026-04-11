import { useEffect, useState } from "react";
import CustomModal from "../../../Components/Modal/Modal";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import { useForm } from "react-hook-form";
import LoaderSpiner from "../../../Components/Common/Loader/LoaderSpiner";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import UseFilter from "../../../Hooks/UseFilter";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import UseShortKey from "../../../Hooks/UseShortKey";
import Button from "../../../Components/Button/Button";
import GymPlanTable from "./PlanTable";
import createAndPlan, { deletePlan, getPlans } from "./planService";

function GymPlan() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [planList, setPlanList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    !planList && getPlans(setPlanList);
  }, []);

  const { register, handleSubmit, setValue, reset } = useForm();

  function handleForm(data) {
    createAndPlan(data, listId, setDrawer, setPlanList, setIsLoading);
    reset();
    setIsEditing(false);
  }

  function onEditClick(row) {
    setListId(row.id);
    setIsEditing(true);

    setValue("name", row.name);
    setValue("price", row.price);
    setValue("duration", row.duration);

    setDrawer(true);
  }

  function onDeleteClick(id) {
    setListId(id);
    setModal(true);
  }

  function handleDeletePlan() {
    deletePlan(listId, setIsLoading, setPlanList, setModal);
  }

  UseShortKey(setDrawer);
  const { filteredData } = UseFilter(planList, "name");

  return (
    <>
      <div className="breadcrumbAndButton">
        <BreadCrumb
          title={"Gym Plans"}
          content={[{ title: "Gym Plans", slug: "#" }]}
        />
        <Button
          onClick={() => {
            setDrawer(true);
            reset();
            setListId(null);
          }}
        >
          Add Gym Plan
        </Button>
      </div>

      <GymPlanTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />

      <CustomModal
        isHeader={false}
        open={modal}
        setOpen={setModal}
        onConfirm={handleDeletePlan}
        loading={isLoading}
        body={<ConfirmModal />}
      />

      <DrawerComponent
        size={"420px"}
        body={
          <form onSubmit={handleSubmit(handleForm)}>
            <div className="grid grid-cols-1 gap-4 lg:gap-5">
              <div className="inputBox">
                <input
                  autoFocus
                  required
                  type="text"
                  className="formControl"
                  {...register("name")}
                />
                <label>
                  Plan Name <span className="text-red-600">*</span>
                </label>
              </div>

              <div className="inputBox">
                <input
                  required
                  type="number"
                  className="formControl"
                  {...register("price")}
                />
                <label>
                  Price ₹ <span className="text-red-600">*</span>
                </label>
              </div>

              <div className="inputBox">
                <input
                  required
                  type="number"
                  className="formControl"
                  {...register("duration")}
                />
                <label>
                  Duration (Month) <span className="text-red-600">*</span>
                </label>
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
        open={drawer}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} Gym Plan`}
      />
    </>
  );
}

export default GymPlan;
