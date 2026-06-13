import { useEffect, useState } from "react";
import CustomModal from "../../../Components/Modal/Modal";
import PlanTable from "./PlanTable";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import createAndPlan, { deletePlan, getPlanData } from "./planServices";
import { useForm } from "react-hook-form";
import LoaderSpiner from "../../../Components/Common/Loader/LoaderSpiner";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import UseFilter from "../../../Hooks/UseFilter";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import UseShortKey from "../../../Hooks/UseShortKey";
import Button from "../../../Components/Button/Button";

function Plan() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [planList, setPlanList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    !planList && getPlanData(setPlanList);
  }, []);

  const { register, handleSubmit, setValue } = useForm();

  function handleForm(data) {
    createAndPlan(data, listId, setDrawer, setPlanList, setIsLoading);
  }
  function onEditClick(row) {
    setListId(row.id);
    setIsEditing(true);

    setValue("name", row.name);
    setValue("duration", row.duration);
    setValue("amount", row.amount);
    setValue("maxGyms", row.maxGyms);
    setValue("maxClients", row.maxClients);
    setValue("description", row.description);

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
      <div className="flex justify-between">
        <BreadCrumb />
        <Button
          onClick={() => {
            setDrawer(true);
            setListId(null);
          }}
        >
          Add new plan
        </Button>
      </div>

      <PlanTable
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
        body={
          <>
            <ConfirmModal />
          </>
        }
      />

      <DrawerComponent
        size={"420px"}
        body={
          <>
            <form onSubmit={handleSubmit(handleForm)}>
              <div className="grid grid-cols-1 gap-4 lg:gap-5">
                <div className="inputBox">
                  <input
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
                    {...register("duration")}
                  />
                  <label>
                    Duration (Months) <span className="text-red-600">*</span>
                  </label>
                </div>

                <div className="inputBox">
                  <input
                    required
                    type="number"
                    className="formControl"
                    {...register("amount")}
                  />
                  <label>
                    Amount ₹ <span className="text-red-600">*</span>
                  </label>
                </div>

                <div className="inputBox">
                  <input
                    type="number"
                    className="formControl"
                    {...register("maxClients")}
                  />
                  <label>Max Clients</label>
                </div>

                <div className="inputBox">
                  <textarea
                    className="formControl"
                    {...register("description")}
                  />
                  <label>Description</label>
                </div>
              </div>

              <button
                disabled={isLoading}
                className="btn ms-auto btn-primary mt-7"
              >
                {isLoading ? <LoaderSpiner /> : "Save"}
              </button>
            </form>
          </>
        }
        open={drawer}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} Plan`}
      />
    </>
  );
}

export default Plan;
