import { RxCross2 } from "react-icons/rx";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom"; // 👈 ADD
import CustomModal from "../../../Components/Modal/Modal";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import { useForm } from "react-hook-form";
import LoaderSpiner from "../../../Components/Common/Loader/LoaderSpiner";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import UseShortKey from "../../../Hooks/UseShortKey";
import Button from "../../../Components/Button/Button";
import GymClientTable from "./ClientTable";
import addEditClient, {
  deleteClient,
  getClientsExcelData,
  getClients,
  receivePending,
  uploadToCloudinary,
} from "./clientService";
import toast from "react-hot-toast";
import { getPlans } from "../Plan/planService";
import { getOffers } from "../Offers/offerService";
import SearchAndChangePage from "../../../Components/Common/GlobleSearch/SearchAndChangePage";
import { showDefaultDataLimit } from "../../../Constant/Constant";
import Pagination from "../../../Components/Pagination/Pagination";
import Card from "../../../Components/Card/Card";
import { createParams } from "../../../Utils/createParams";
import { Modal, SelectPicker } from "rsuite";
import { LoaderContext } from "../../../Context/LoaderContext";
import { ThemeContext } from "../../../Context/ThemeContext";
import RadioSelect from "../../../Components/Form/InputBox/RadioSelect";
import renewPlan from "../RenewList/renewService";
import { MdLoop } from "react-icons/md";
import ClientGrid from "./ClientGrid";
import Tabs from "./Tabs";
import downloadXl from "../../../Utils/downloadXl";
import { getClientExcelColumns } from "./clientExcelConfig";

function GymClient() {
  const [view, setView] = useState("table");
  const location = useLocation(); // 👈
  const isExpiredPage = location.pathname.includes("expired"); // 👈
  const isDeactivePage = location.pathname.includes("deactive"); // 👈
  const isPending = location.pathname.includes("pending-payments"); // 👈
  const [isRenewal, setIsRenewal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { setTpLoader } = useContext(LoaderContext);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [listId, setListId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [planList, setPlanList] = useState();
  const [offerList, setOfferList] = useState();
  const [selectedPlanOffer, setSelectedPlanOffer] = useState(null);
  const [selectedRenewPlanOffer, setSelectedRenewPlanOffer] = useState(null);

  useEffect(() => {
    if (location.pathname.includes("add-client")) {
      setDrawer(true);
    }
  }, [location]);

  const { reload, setReload } = useContext(ThemeContext);

  const [data, setData] = useState();
  const [dataIndb, setDataInDB] = useState(0);

  const [limit, setLimit] = useState(showDefaultDataLimit);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({});
  useEffect(() => {
    setData();
    setDataInDB();
    fetchData();
  }, [limit, page, filter, reload, location.pathname]); // 👈 ADD THIS

  function fetchData() {
    getClients(
      createParams({
        limit,
        page,
        gender: isExpiredPage ? undefined : filter.gender,
        isExpired: isExpiredPage ? 1 : 0, // 👈 KEY
        isDeactive: isDeactivePage ? 1 : 0, // 👈 KEY
        isPending: isPending ? 1 : 0,
        search,
      }),
      setData,
      setDataInDB,
    );
  }

  useEffect(() => {
    getPlans(setPlanList);
    getOffers(setOfferList);
  }, [reload]);

  const { register, handleSubmit, watch, setValue, reset } = useForm({
    gender: "male",
  });
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    watch: watch2,
    setValue: setValue2,
  } = useForm();
  const {
    register: register3,
    handleSubmit: handleSubmit3,
    watch: watch3,
  } = useForm();

  const getOfferDates = (offer) => {
    const start = new Date(offer?.offerStartDate || "");
    const end = new Date(offer?.offerEndDate);
    return { start, end };
  };

  const isOfferValid = (offer, dateValue) => {
    if (!offer || !Number(offer?.isActive)) return false;
    const { start, end } = getOfferDates(offer);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()))
      return false;
    const date = dateValue ? new Date(dateValue) : new Date();
    return date >= start && date <= end;
  };

  const getValidOfferForPlan = (planId, dateValue) => {
    return (
      (offerList || []).find(
        (offer) =>
          String(offer.planId) === String(planId) &&
          isOfferValid(offer, dateValue),
      ) || null
    );
  };

  const normalizeWithOfferValue = (value) => (value ? 1 : 0);

  const validateAndSetWithOffer = (offer, setValueFn, fieldName) => {
    if (offer) {
      setValueFn(fieldName, 1);
      return offer;
    }
    setValueFn(fieldName, 0);
    return null;
  };

  function handleForm(data) {
    const plan = Number(data.planAmount) || 0;

    // 🔥 yahi fix hai
    const paid = data.paidAmount ? Number(data.paidAmount) : plan;

    const pending = Number(data.pendingAmount) || 0;

    let discount = plan - paid - pending;
    if (discount < 0) discount = 0;

    const payload = {
      ...data,
      paidAmount: paid,
      pendingAmount: pending,
      discountAmount: discount,
      lastRenewalDate: data.joiningDate,
    };

    // Object.keys(payload).forEach((key) => {
    //   if (key === "photo" && data.photo?.[0]) {
    //     formData.append(key, data.photo[0]);
    //   } else {
    //     formData.append(key, payload[key]);
    //   }
    // });

    addEditClient(payload, listId, setDrawer, setData, setIsLoading);
  }
  function handleRenewPlan(data) {
    const plan = Number(data.planAmount) || 0;

    const paid = data.paidAmount ? Number(data.paidAmount) : plan;

    const pending = Number(data.pendingAmount) || 0;

    let discount = plan - paid - pending;
    if (discount < 0) discount = 0;

    const payload = {
      ...data,
      paidAmount: paid,
      pendingAmount: pending,
      discountAmount: discount,
      clientId: selectedRow.id,
    };

    renewPlan(payload, setRenewalModal, null, setIsLoading, setReload);
    // return

    // addEditClient(payload, listId, setDrawer, setData, setIsLoading);
  }

  const currentWatch = isRenewal ? watch2 : watch;
  const currentSetValue = isRenewal ? setValue2 : setValue;

  useEffect(() => {
    const plan = Number(currentWatch("planAmount")) || 0;
    let paid = Number(currentWatch("paidAmount")) || 0;
    let pending = Number(currentWatch("pendingAmount")) || 0;

    // 🔥 main formula
    let discount = plan - paid - pending;

    if (discount < 0) {
      discount = 0;

      // adjust pending if overflow
      const extra = paid + pending - plan;
      if (pending >= extra) {
        pending -= extra;
      } else {
        const remain = extra - pending;
        pending = 0;
        paid -= remain;
      }
    }

    currentSetValue("paidAmount", paid);
    currentSetValue("pendingAmount", pending);
    currentSetValue("discountAmount", discount);
  }, [
    currentWatch("planAmount"),
    currentWatch("paidAmount"),
    currentWatch("pendingAmount"),
    isRenewal,
  ]);

  const handlePendingChange = (value) => {
    const plan = Number(currentWatch("planAmount")) || 0;
    const paid = Number(currentWatch("paidAmount")) || 0;

    let pending = value;

    let discount = plan - paid - pending;

    if (discount < 0) {
      discount = 0;
      pending = plan - paid; // clamp
    }

    currentSetValue("pendingAmount", pending);
    currentSetValue("discountAmount", discount);
  };

  const handleDiscountChange = (value) => {
    const plan = Number(currentWatch("planAmount")) || 0;
    const paid = Number(currentWatch("paidAmount")) || 0;

    let discount = value;

    let pending = plan - paid - discount;

    if (pending < 0) {
      pending = 0;
      discount = plan - paid;
    }

    currentSetValue("discountAmount", discount);
    currentSetValue("pendingAmount", pending);
  };

  function onEditClick(row) {
    setListId(row.id);
    setIsEditing(true);

    setValue("clientName", row.clientName);
    setValue("mobileNo", row.mobileNo);
    setValue("planId", row.planId);
    setValue("joiningDate", row.joiningDate?.slice(0, 10));
    setValue("active", row.active);
    setValue("gender", row.gender);
    setValue("planAmount", row.plan.amount);
    setValue("paidAmount", row.paidAmount);
    setValue("pendingAmount", row.pendingAmount);
    setValue("discountAmount", row.discountAmount);

    setDrawer(true);
  }

  function onChangeStatus(status, id, type) {
    addEditClient(
      { [type]: Number(status) },
      id,
      setDrawer,
      setData,
      setTpLoader,
    );
  }

  function onDeleteClick(item) {
    setListId(item.id);
    setModal(true);
  }

  function handleDeleteClient() {
    deleteClient(listId, setIsLoading, setData, setModal);
  }

  UseShortKey(setDrawer);

  function callAfterSearch(search) {
    setData();
    setPage(1);
    getClients(
      createParams({
        limit,
        page: 1,
        search,
        gender: filter.gender,
        isExpired: isExpiredPage ? 1 : 0,
        isDeactive: isDeactivePage ? 1 : 0, // 👈 KEY
        isPending: isPending ? 1 : 0,
      }),
      setData,
      setDataInDB,
    );
  }

  const [renewalModal, setRenewalModal] = useState(false);

  function onRenewalClick(client) {
    setRenewalModal(true);
    setSelectedRow(client);
    setIsRenewal(true);
  }
  const [pendingModal, setPendingModal] = useState();
  function onClearPending(item) {
    setSelectedRow(item);
    setPendingModal(true);
  }

  function handleClearPending(data) {
    const payload = {
      amount: Number(data.amount),
      markAsDiscount: Number(data.markAsDiscount),
    };
    receivePending(
      { id: selectedRow.id, data: payload },
      // setIsLoading,
      null,
      setPendingModal,
      setReload,
    );
  }

  const pageTitle = isExpiredPage
    ? "Expired Clients"
    : isDeactivePage
      ? "Deactive Clients"
      : isPending
        ? "Pending Payents"
        : "Clients";
  const isAllClientPage = !isExpiredPage && !isDeactivePage && !isPending;

  // upload photo system

  const [photoModal, setPhotoModal] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  function onUploadPhotoClick(item) {
    setSelectedRow(item);
    setPhotoModal(true);
  }
  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
    }
  }
  async function handleUploadPhoto() {
    if (!photoFile) return;

    try {
      setIsLoading(true);

      // 1. upload to cloudinary
      const imageUrl = await uploadToCloudinary(photoFile);

      // 2. backend ko URL bhej
      await addEditClient(
        { photo: imageUrl }, // 👈 IMPORTANT
        selectedRow.id,
        setPhotoModal,
        setData,
        setIsLoading,
      );

      setPhotoFile(null);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  }

  async function handleDownloadExcel() {
    const query = createParams({
      gender: filter.gender,
      search,
      isExpired: isExpiredPage ? 1 : 0,
      isDeactive: isDeactivePage ? 1 : 0,
      isPending: isPending ? 1 : 0,
    });

    const excelData = await getClientsExcelData(query, setIsExcelLoading);
    if (!excelData.length) return;

    const columns = getClientExcelColumns();
    const date = new Date().toISOString().split("T")[0];
    const fileName = `clients-list-${date}.xlsx`;

    downloadXl(columns, excelData, fileName);
  }

  return (
    <>
      {/* 🔥 Header */}
      <div className="breadcrumbAndButton">
        <BreadCrumb
          title={pageTitle}
          content={[
            {
              title: pageTitle,
              slug: "#",
            },
          ]}
        />

        {!planList?.length ? (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-light sm:hidden">
              Create a membership plan before adding clients.
            </span>

            <Link
              to="/membership-plans"
              className="text-primary font-semibold hover:underline  "
            >
              <span>Create Plan </span>{" "}
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {isAllClientPage && (
              <div className="flex items-center gap-3">
                <Button
                  icon="excel"
                  variant="success"
                  disabled={isExcelLoading}
                  onClick={handleDownloadExcel}
                >
                  {isExcelLoading ? <LoaderSpiner /> : "Download Excel"}
                </Button>
              </div>
            )}
            {!isExpiredPage && (
              <Button
                onClick={() => {
                  setDrawer(true);
                  reset();
                  setListId(null);
                  setIsRenewal(false);
                }}
              >
                Add Client
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 🔥 Search + Filter */}
      <SearchAndChangePage
        placeholder={"Search By Name or Mobile No"}
        limit={limit}
        search={search}
        setLimit={setLimit}
        setSearch={setSearch}
        callAfterSearch={callAfterSearch}
        afterform={
          <Tabs view={view} setView={setView} className={`md:block hidden`} />
        }
      >
        <>
          {!isExpiredPage && (
            <SelectPicker
              onChange={(val) => {
                setFilter((prev) => ({ ...prev, gender: val }));
                setPage(1);
              }}
              data={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
              ]}
              cleanable
              placeholder={"Filter By Gender"}
              className="min-w-[160px] lg:w-full picker"
            />
          )}
          <Tabs view={view} setView={setView} className={`md:hidden`} />
        </>
      </SearchAndChangePage>

      {/* 🔥 Table */}
      {view === "table" ? (
        <Card className="!rounded-none !p-0" isBorder>
          <GymClientTable
            paginate={{ page, limit }}
            data={data}
            isExpired={isExpiredPage}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
            onChangeStatus={onChangeStatus}
            onRenewalClick={onRenewalClick}
            onClearPending={onClearPending}
            isPending={isPending}
            onUploadPhotoClick={onUploadPhotoClick}
          />
        </Card>
      ) : (
        <ClientGrid
          data={data}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          onRenewalClick={onRenewalClick}
          onUploadPhotoClick={onUploadPhotoClick}
          onClearPending={onClearPending}
          isPending={isPending}
        />
      )}
      {/* 🔥 Grid View */}

      {/* 🔥 Pagination */}
      <Pagination
        dataInDb={dataIndb}
        limit={limit}
        setPage={setPage}
        page={page}
      />

      {/* ❌ Modals only for normal */}
      <>
        <DrawerComponent
          size={"480px"}
          body={
            <form onSubmit={handleSubmit(handleForm)}>
              <div className="grid grid-cols-2 gap-4 lg:gap-5">
                <div className="inputBox">
                  <input
                    autoFocus
                    required
                    type="text"
                    className="formControl"
                    {...register("clientName")}
                  />
                  <label>
                    Client Name <span className="text-red-600">*</span>
                  </label>
                </div>
                <div className="inputBox">
                  <input
                    required
                    type="number"
                    minLength={10}
                    className="formControl"
                    {...register("mobileNo")}
                  />
                  <label>
                    Mobile No <span className="text-red-600">*</span>
                  </label>
                </div>
                <div className="col-span-full">
                  <RadioSelect
                    label="Gender"
                    name="gender"
                    register={register}
                    watch={watch}
                    required
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                    ]}
                  />
                </div>

                {!listId ? (
                  <>
                    {/* Plan Selection with Amount Pill */}
                    <div className="relative inputBox col-span-full">
                      <select
                        required
                        className="formControl capitalize"
                        {...register("planId", {
                          onChange: (e) => {
                            const selectedPlan = planList.find(
                              (p) => p.id === e.target.value,
                            );
                            const selectedDate =
                              watch("joiningDate") ||
                              new Date().toISOString().slice(0, 10);
                            setValue("planAmount", selectedPlan?.price || 0);
                            setValue("paidAmount", selectedPlan?.price || 0);
                            setValue("discountAmount", 0);

                            const offer = getValidOfferForPlan(
                              e.target.value,
                              selectedDate,
                            );
                            setSelectedPlanOffer(offer);
                            validateAndSetWithOffer(
                              offer,
                              setValue,
                              "withOffer",
                            );
                          },
                        })}
                      >
                        <option value="">Select Plan</option>
                        {planList?.map((plan) => (
                          <option
                            key={plan.id}
                            value={plan.id}
                            className="capitalize"
                          >
                            {plan.name}
                          </option>
                        ))}
                      </select>
                      <label>
                        Plan <span className="text-red-600">*</span>
                      </label>

                      {/* Pill inside the inputBox, top-right corner */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm font-medium pointer-events-none">
                        ₹ {watch("planAmount") || 0}
                      </div>
                    </div>

                    {/* Paid Amount */}
                    <div className="inputBox">
                      <input
                        type="number"
                        className="formControl notRequired"
                        {...register("paidAmount")}
                      />
                      <label
                        className={`${watch("paidAmount") ? "editLabel" : ""}`}
                      >
                        Paid Amount (optional)
                      </label>
                    </div>

                    {/* Pending Amount */}
                    <div className="inputBox">
                      <input
                        type="number"
                        className="formControl notRequired"
                        {...register("pendingAmount", {
                          onChange: (e) =>
                            handlePendingChange(Number(e.target.value)),
                        })}
                      />
                      <label
                        className={`${watch("pendingAmount") ? "editLabel" : ""}`}
                      >
                        Pending Amount (optional)
                      </label>
                    </div>

                    {/* Discount Amount */}
                    <div className="inputBox">
                      <input
                        type="number"
                        className="formControl notRequired"
                        {...register("discountAmount", {
                          onChange: (e) =>
                            handleDiscountChange(Number(e.target.value)),
                        })}
                      />
                      <label
                        className={`${watch("discountAmount") ? "editLabel" : ""}`}
                      >
                        Discount Amount (optional)
                      </label>
                    </div>

                    <div className="inputBox">
                      <input
                        required
                        type="date"
                        className="formControl"
                        {...register("joiningDate", {
                          onChange: (e) => {
                            const planId = watch("planId");
                            const offer = getValidOfferForPlan(
                              planId,
                              e.target.value,
                            );
                            setSelectedPlanOffer(offer);
                            validateAndSetWithOffer(
                              offer,
                              setValue,
                              "withOffer",
                            );
                          },
                        })}
                      />
                      <label>
                        Joining Date <span className="text-red-600">*</span>
                      </label>
                    </div>
                    {/* withOffer hidden + checkbox */}
                    <input type="hidden" {...register("withOffer")} />
                    <div className="col-span-full flex items-center gap-2">
                      <input
                        id="withOfferCheck"
                        type="checkbox"
                        checked={Boolean(Number(watch("withOffer")))}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const planId = watch("planId");
                          const selectedDate =
                            watch("joiningDate") ||
                            new Date().toISOString().slice(0, 10);
                          const offer = getValidOfferForPlan(
                            planId,
                            selectedDate,
                          );
                          if (isChecked && !offer) {
                            toast.error(
                              "No active offer found for this plan and joining date.",
                            );
                            setValue("withOffer", 0);
                            setSelectedPlanOffer(null);
                            return;
                          }
                          setSelectedPlanOffer(offer);
                          setValue(
                            "withOffer",
                            normalizeWithOfferValue(isChecked),
                          );
                        }}
                        className="cursor-pointer"
                      />
                      <label htmlFor="withOfferCheck">
                        Apply available offer
                      </label>
                    </div>

                    {/* show selected offer details */}
                    {selectedPlanOffer && (
                      <div className="col-span-full border border-color p-3 rounded-md bg-light">
                        <div className="text-sm font-semibold">
                          Available Offer
                        </div>
                        <div className="text-xs">
                          {selectedPlanOffer.offerName} —{" "}
                          {selectedPlanOffer.days || 0} days
                        </div>
                        <div className="text-xs text-gray-500">
                          Valid:{" "}
                          {selectedPlanOffer.offerStartDate?.slice(0, 10) ||
                            "-"}{" "}
                          to{" "}
                          {selectedPlanOffer.offerEndDate?.slice(0, 10) || "-"}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  ""
                )}

                {/* <CameraCapture setValue={setValue} /> */}
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
          title={`${!isEditing ? "Add New" : "Update"} Client`}
        />

        <CustomModal
          isHeader={false}
          open={modal}
          setOpen={setModal}
          onConfirm={handleDeleteClient}
          loading={isLoading}
          body={<ConfirmModal />}
        />
        <Modal
          size={"400px"}
          backdrop={"static"}
          keyboard={false}
          open={renewalModal}
          onClose={() => setRenewalModal(false)}
        >
          <Modal.Body>
            <div className="relative">
              {/* Close Icon */}
              <div className="bg-light p-2.5">
                <button
                  onClick={() => setRenewalModal(false)}
                  className="absolute right-3 top-3 hover:text-red-600"
                >
                  <RxCross2 />
                </button>

                {/* Title */}
                <div className="capitalize">
                  <span className="text-primary font-semibold">
                    {" "}
                    Renew {selectedRow?.clientName}
                    {"'s"} Plan
                  </span>
                </div>
              </div>

              <div className="p-3">
                <form onSubmit={handleSubmit2(handleRenewPlan)}>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Plan */}
                    <div className="relative inputBox col-span-full">
                      <select
                        required
                        className="formControl capitalize"
                        {...register2("planId", {
                          onChange: (e) => {
                            const selectedPlan = planList.find(
                              (p) => p.id === e.target.value,
                            );
                            setValue2("planAmount", selectedPlan?.price || 0);
                            setValue2("paidAmount", selectedPlan?.price || 0);
                            setValue2("pendingAmount", 0);
                            setValue2("discountAmount", 0);
                            const selectedDate =
                              watch2("renewalDate") ||
                              new Date().toISOString().slice(0, 10);
                            const offer = getValidOfferForPlan(
                              e.target.value,
                              selectedDate,
                            );
                            setSelectedRenewPlanOffer(offer);
                            validateAndSetWithOffer(
                              offer,
                              setValue2,
                              "withOffer",
                            );
                          },
                        })}
                      >
                        <option value="">Select Plan</option>
                        {planList?.map((plan) => (
                          <option key={plan.id} value={plan.id}>
                            {plan.name}
                          </option>
                        ))}
                      </select>
                      <label>
                        Plan <span className="text-red-600">*</span>
                      </label>

                      {/* Amount Pill */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-green-100 text-green-800 rounded-full px-3 py-1 text-sm pointer-events-none">
                        ₹ {watch2("planAmount") || 0}
                      </div>
                    </div>

                    {/* Paid */}
                    <div className="inputBox">
                      <input
                        type="number"
                        className="formControl notRequired"
                        {...register2("paidAmount")}
                      />
                      <label
                        className={watch2("paidAmount") ? "editLabel" : ""}
                      >
                        Paid Amount
                      </label>
                    </div>

                    {/* Pending */}
                    <div className="inputBox">
                      <input
                        type="number"
                        {...register2("pendingAmount", {
                          onChange: (e) =>
                            handlePendingChange(Number(e.target.value)),
                        })}
                        className="formControl notRequired"
                      />
                      <label
                        className={watch2("pendingAmount") ? "editLabel" : ""}
                      >
                        Pending Amount
                      </label>
                    </div>

                    {/* Discount */}
                    <div className="inputBox">
                      <input
                        type="number"
                        {...register2("discountAmount", {
                          onChange: (e) =>
                            handleDiscountChange(Number(e.target.value)),
                        })}
                        className="formControl notRequired"
                      />

                      <label
                        className={watch2("discountAmount") ? "editLabel" : ""}
                      >
                        Discount Amount
                      </label>
                    </div>

                    {/* Renewal Date */}
                    <div className="inputBox col-span-full">
                      <input
                        required
                        type="date"
                        className="formControl"
                        {...register2("renewalDate", {
                          onChange: (e) => {
                            const planId = watch2("planId");
                            const offer = getValidOfferForPlan(
                              planId,
                              e.target.value,
                            );
                            setSelectedRenewPlanOffer(offer);
                            validateAndSetWithOffer(
                              offer,
                              setValue2,
                              "withOffer",
                            );
                          },
                        })}
                      />
                      <label>
                        Renewal Date <span className="text-red-600">*</span>
                      </label>
                    </div>
                    <input type="hidden" {...register2("withOffer")} />
                    <div className="col-span-full flex items-center gap-2">
                      <input
                        id="withOfferCheck2"
                        type="checkbox"
                        checked={Boolean(Number(watch2("withOffer")))}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          const planId = watch2("planId");
                          const selectedDate =
                            watch2("renewalDate") ||
                            new Date().toISOString().slice(0, 10);
                          const offer = getValidOfferForPlan(
                            planId,
                            selectedDate,
                          );
                          if (isChecked && !offer) {
                            toast.error(
                              "No active offer found for this plan and renewal date.",
                            );
                            setValue2("withOffer", 0);
                            setSelectedRenewPlanOffer(null);
                            return;
                          }
                          setSelectedRenewPlanOffer(offer);
                          setValue2(
                            "withOffer",
                            normalizeWithOfferValue(isChecked),
                          );
                        }}
                        className="cursor-pointer"
                      />
                      <label htmlFor="withOfferCheck2">
                        Apply available offer
                      </label>
                    </div>

                    {selectedRenewPlanOffer && (
                      <div className="col-span-full border border-color p-3 rounded-md bg-light">
                        <div className="text-sm font-semibold">
                          Available Offer
                        </div>
                        <div className="text-xs">
                          {selectedRenewPlanOffer.offerName} —{" "}
                          {selectedRenewPlanOffer.days || 0} days
                        </div>
                        <div className="text-xs text-gray-500">
                          Valid:{" "}
                          {selectedRenewPlanOffer.offerStartDate?.slice(
                            0,
                            10,
                          ) || "-"}{" "}
                          to{" "}
                          {selectedRenewPlanOffer.offerEndDate?.slice(0, 10) ||
                            "-"}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    disabled={isLoading}
                    className="btn btn-primary mt-6 ms-auto !text-xs"
                  >
                    <MdLoop size={16} />{" "}
                    {isLoading ? <LoaderSpiner /> : "Renew Plan"}
                  </button>
                </form>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        <Modal
          size={"400px"}
          backdrop={"static"}
          keyboard={false}
          open={pendingModal}
          onClose={() => setPendingModal(false)}
        >
          <Modal.Body>
            <div className="relative">
              {/* Close Icon */}
              <div className="bg-light p-2.5">
                <button
                  onClick={() => setPendingModal(false)}
                  className="absolute right-3 top-3 hover:text-red-600"
                >
                  <RxCross2 />
                </button>

                {/* Title */}
                <div className="capitalize">
                  <span className="text-primary font-semibold">
                    Clear Pending - {selectedRow?.clientName}
                  </span>
                </div>

                {/* 🔥 Total Pending */}
                <div className="text-xs text-red-600 mt-1">
                  Total Pending: ₹ {selectedRow?.totalPendingAmount || 0}
                </div>
              </div>

              <div className="p-3">
                <form onSubmit={handleSubmit3(handleClearPending)}>
                  <div className="grid grid-cols-2 gap-3">
                    {/* 🔥 Pending Amount Input */}
                    <div className="inputBox col-span-full">
                      <input
                        type="number"
                        className="formControl"
                        {...register3("amount")}
                      />
                      <label className={watch3("amount") ? "editLabel" : ""}>
                        Enter Amount
                      </label>
                    </div>

                    {/* 🔥 Remaining Auto Show */}
                    <div className="col-span-full text-xs text-gray-500">
                      Remaining Pending: ₹{" "}
                      {Math.max(
                        (selectedRow?.totalPendingAmount || 0) -
                          (Number(watch3("amount")) || 0),
                        0,
                      )}
                    </div>

                    {/* 🔥 Checkbox */}
                    <div className="col-span-full flex items-center gap-2">
                      <input
                        type="checkbox"
                        {...register3("markAsDiscount")}
                        id="discountCheck"
                      />
                      <label htmlFor="discountCheck" className="text-sm">
                        Convert remaining to discount
                      </label>
                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    disabled={isLoading}
                    className="btn btn-primary mt-5 ms-auto !text-xs"
                  >
                    {isLoading ? <LoaderSpiner /> : "Clear Pending"}
                  </button>
                </form>
              </div>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          size="350px"
          open={photoModal}
          onClose={() => setPhotoModal(false)}
        >
          <Modal.Body>
            <div className="text-center p-4 border border-color rounded-md">
              <h3 className="font-semibold mb-4">Upload Client Photo</h3>

              {/* Gallery */}
              <label className="block mb-3 cursor-pointer border border-color p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                📁 Choose from Gallery
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Camera */}
              <label className="block mb-3 cursor-pointer border border-color p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                📸 Capture Photo
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Preview */}
              {photoFile && (
                <img
                  src={URL.createObjectURL(photoFile)}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-3"
                />
              )}

              {/* Upload Button */}
              <button
                onClick={handleUploadPhoto}
                disabled={isLoading}
                className="btn btn-primary w-full mt-2"
              >
                {isLoading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    </>
  );
}

export default GymClient;
