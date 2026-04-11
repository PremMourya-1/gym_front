import { useEffect, useState } from "react";
import UseFilter from "../../../Hooks/UseFilter";
import addEditCoupon, { deleteCoupon, getCouponList } from "./couponService";
import { useForm } from "react-hook-form";
import { LuPlus } from "react-icons/lu";
import CouponTable from "./CouponTable";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import moment from "moment/moment";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import UseShortKey from "../../../Hooks/UseShortKey";
import Tippy from "@tippyjs/react";

function Coupon() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [couponList, setCouponList] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => {
    !couponList && getCouponList(setCouponList);
  }, []);
  const { register, handleSubmit, setValue, reset } = useForm();

  function handleCreateCoupon(data) {
    addEditCoupon(
      isEditing,
      { ...data, code },
      listId,
      setIsLoading,
      setDrawer,
      setCouponList
    );
  }
  function onEditClick(row) {
    setListId(row.id);
    setIsEditing(true);
    setDrawer(true);
    setCode(row.code);
    setValue("discount", row.discount);
    setValue("startDate", moment(row.startDate).format("YYYY-MM-DD"));
    setValue("endDate", moment(row.endDate).format("YYYY-MM-DD"));
  }
  function onDeleteClick(id) {
    setListId(id);
    setModal(true);
  }
  function handleDeleteCoupon() {
    deleteCoupon(listId, setIsLoading, setCouponList, setModal);
  }
  UseShortKey(setDrawer);
  const { query, setQuery, filteredData } = UseFilter(couponList, "code");
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
                  reset();
                  setDrawer(true);
                  setIsEditing(false);
                }}
                className={`btn group  btn-primary md:w-full`}
              >
                <LuPlus className="h-4 w-4 group-hover:fill-white transition-none" />
                {`Create  Coupon`}
              </button>
            </Tippy>
          </div>
        </div>
      </div>

      <CouponTable
        data={filteredData}
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
      />
      <CustomModal
        isHeader={false}
        open={modal}
        setOpen={setModal}
        onConfirm={handleDeleteCoupon}
        loading={isLoading}
        body={
          <>
            <ConfirmModal />
          </>
        }
      />
      <DrawerComponent
        size={"600px"}
        body={
          <>
            <form onSubmit={handleSubmit(handleCreateCoupon)}>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-8 lg:gap-5">
                <div className="inputBox">
                  <input
                    required
                    type={"text"}
                    className={`formControl uppercase`}
                    onChange={(e) => {
                      setCode(e.target.value?.trim());
                    }}
                    value={code}
                    autoFocus
                  />
                  <label htmlFor={"id"}>
                    Coupon Code <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type={"number"}
                    className={`formControl `}
                    {...register("discount")}
                  />
                  <label htmlFor={"id"}>
                    Discount Value in % <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type={"date"}
                    className={`formControl `}
                    {...register("startDate")}
                  />
                  <label className="pe-4" htmlFor={"id"}>
                    Start Date <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type={"date"}
                    className={`formControl `}
                    {...register("endDate")}
                  />
                  <label className="pe-4" htmlFor={"id"}>
                    End Date <span className="text-red-600"> *</span>
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
          </>
        }
        open={drawer}
        setOpen={setDrawer}
        title={`${!isEditing ? "Add New" : "Update"} Coupon`}
      />
    </>
  );
}

export default Coupon;
