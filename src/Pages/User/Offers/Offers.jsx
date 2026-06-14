import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import LoaderSpiner from "../../../Components/Common/Loader/LoaderSpiner";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import Button from "../../../Components/Button/Button";
import UseFilter from "../../../Hooks/UseFilter";
import UseShortKey from "../../../Hooks/UseShortKey";
import { getPlans } from "../Plan/planService";
import createAndOffer, { deleteOffer, getOffers } from "./offerService";
import OffersTable from "./OffersTable";
import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

const toInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

function Offers() {
  const { reload } = useContext(ThemeContext);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [offerList, setOfferList] = useState();
  const [planList, setPlanList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setPlanList();
    !offerList && getOffers(setOfferList);
    !planList?.length && getPlans(setPlanList);
  }, [reload]);

  const { register, handleSubmit, setValue, reset, watch } = useForm();

  const offerStartDate = watch("offerStartDate");

  function handleForm(data) {
    if (new Date(data.offerStartDate) > new Date(data.offerEndDate)) {
      toast.error("Offer end date should be after start date");
      return;
    }

    const payload = {
      ...data,
      planId: data.planId,
      days: Number(data.days),
    };

    createAndOffer(payload, listId, setDrawer, setOfferList, setIsLoading);
    // reset();
    // setIsEditing(false);
  }

  function onEditClick(row) {
    setListId(row.id);
    setIsEditing(true);

    setValue("offerName", row.offerName || row.name || "");
    setValue("planId", row.planId || row.planData?.id || row.plan?.id || "");
    setValue(
      "offerStartDate",
      toInputDate(row.offerStartDate || row.startDate || row.createdAt),
    );
    setValue("offerEndDate", toInputDate(row.offerEndDate || row.endDate));
    setValue("days", row.days || "");

    setDrawer(true);
  }

  function onDeleteClick(id) {
    setListId(id);
    setModal(true);
  }

  function handleDeleteOffer() {
    deleteOffer(listId, setIsLoading, setOfferList, setModal);
  }

  function onChangeStatus(checked, id, type) {
    // checked can be 1/0 from Switch; convert to boolean
    // const active = Boolean(checked);
    // toggleOfferActive(id, active, setIsLoading, setOfferList);
    createAndOffer(
      { [type]: Number(checked) },
      id,
      setDrawer,
      setOfferList,
      setIsLoading,
    );
  }

  UseShortKey(setDrawer);
  const { filteredData } = UseFilter(offerList, "offerName");

  return (
    <>
      <div className="breadcrumbAndButton">
        <BreadCrumb
          title={"offers"}
          content={[{ title: "Offers", slug: "#" }]}
        />
        <Button
          onClick={() => {
            setDrawer(true);
            reset();
            setListId(null);
            setIsEditing(false);
          }}
        >
          Add Offer
        </Button>
      </div>

      <OffersTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        onChangeStatus={onChangeStatus}
      />

      <CustomModal
        isHeader={false}
        open={modal}
        setOpen={setModal}
        onConfirm={handleDeleteOffer}
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
                  {...register("offerName")}
                />
                <label>
                  Offer Name <span className="text-red-600">*</span>
                </label>
              </div>

              <div className="inputBox">
                <select
                  className="formControl"
                  {...register("planId")}
                  required
                >
                  <option value="">Select Plan</option>
                  {planList?.map((plan) => {
                    return (
                      <option key={plan.id} value={plan.id}>
                        {plan.name}
                      </option>
                    );
                  })}
                </select>
                <label>
                  Apply Offer On <span className="text-red-600">*</span>
                </label>
              </div>

              <div className="inputBox">
                <input
                  required
                  type="date"
                  className="formControl"
                  {...register("offerStartDate")}
                />
                <label>
                  Offer Start Date <span className="text-red-600">*</span>
                </label>
              </div>

              <div className="inputBox">
                <input
                  required
                  type="date"
                  min={offerStartDate || ""}
                  className="formControl"
                  {...register("offerEndDate")}
                />
                <label>
                  Offer End Date <span className="text-red-600">*</span>
                </label>
              </div>

              <div className="inputBox">
                <input
                  required
                  type="number"
                  min={1}
                  className="formControl"
                  {...register("days")}
                />
                <label>
                  Extra Days <span className="text-red-600">*</span>
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
        title={`${!isEditing ? "Add New" : "Update"} Offer`}
      />
    </>
  );
}

export default Offers;
