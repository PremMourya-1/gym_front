import { useContext, useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import DrawerComponent from "../../../Components/Drawer/Drawer";
import { useForm } from "react-hook-form";
import SchoolListTable from "./SchoolListTable";
import createSchool, {
  deleteSchool,
  editSchool,
  getSchoolList,
} from "./schoolService";
import LoaderSpiner from "../../../Components/Common/Loader/LoaderSpiner";
import moment from "moment/moment";
import CustomModal from "../../../Components/Modal/Modal";
import ConfirmModal from "../../../Components/Modal/ConfirmModal";
import { useDispatch, useSelector } from "react-redux";
import adminApi from "../../../Service/api";
import { setState } from "../../../Store/Slices/StateSlice";
import { getPlanData } from "../Plan/planServices";
import notRequiredInput, { inputBlur } from "../../../Utils/notRequired";
import UseFilter from "../../../Hooks/UseFilter";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import Tippy from "@tippyjs/react";
import UseShortKey from "../../../Hooks/UseShortKey";
import { LoaderContext } from "../../../Context/LoaderContext";

function School() {
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [schoolList, setSchoolList] = useState();
  const [listId, setListId] = useState(null);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);

  const state = useSelector((state) => state.state);
  const [stateList, setStateList] = useState();
  const [districtList, setDistrictList] = useState([]);
  const [password, setPassword] = useState({});
  const [isShow, setIsShow] = useState({ pass: false, conPass: false });
  const [selectedState, setSelectedState] = useState();
  const { setTpLoader } = useContext(LoaderContext);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [planList, setPlanList] = useState();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    !planList && getPlanData(setPlanList);
  }, []);

  async function getDistrictData(id) {
    try {
      const res = await adminApi.district(id);
      setDistrictList(res.data.data);
      return res;
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    (async () => {
      if (!schoolList) {
        getSchoolList(setSchoolList);
      }
    })();
  }, []);

  useEffect(() => {
    if (!state) {
      (async () => {
        try {
          const res = await adminApi.state();
          dispatch(setState(res.data.data));
        } catch (e) {
          console.log(e);
        }
      })();
    } else setStateList(state);
  }, [state]);

  // create school
  function handleCreateSchool(data) {
    if (!password.error) {
      const payload = {
        ...data,
        password: password.password,
        isActive: Number(isActive),
        state: selectedState?.split("-")[0],
        district: data.district?.split("-")[0],
      };
      const formData = new FormData();
      Object.keys(payload).forEach((item) => {
        if (payload[item]) {
          formData.append(item, payload[item]);
        }
      });

      if (isEditing) {
        handleEditSchool(formData);
      } else {
        createSchool(formData, setIsLoading, setSchoolList, setDrawer, reset);
      }
    }
  }

  useEffect(() => {
    if (password.password !== password.conPassword) {
      setPassword((prev) => {
        return { ...prev, error: true };
      });
    } else {
      setPassword((prev) => {
        return { ...prev, error: false };
      });
    }
  }, [password.password, password.conPassword]);

  // setting default values in form for edit school list
  async function onEditClick(row) {
    console.log(row);
    setListId(row.id);
    setIsEditing(true);

    row.isUpdate && delete row.isUpdate;
    Object.keys(row).forEach((item) => {
      if (item === "expDate") {
        setValue(item, moment(row[item]).format("YYYY-MM-DD"));
      } else item === "password" ? "" : setValue(item, row[item]);
    });
    setIsActive(row.isActive);
    const stateObj = stateList.find((it) => it.SName === row.state);
    setSelectedState(`${stateObj.SName}-${stateObj.id}`);
    const res = await getDistrictData(stateObj.id);

    const districtObj = res.data.data.find(
      (it) => it.DistrictName === row.district
    );
    setValue("district", `${districtObj?.DistrictName}-${districtObj.id}`);
    setDrawer(true);
  }

  useEffect(() => {
    getDistrictData(selectedState?.split("-")[1]);
  }, [selectedState]);
  function onDeleteClick(id) {
    setListId(id);
    setModal(true);
  }

  // delete school
  function handleDeleteSchool() {
    deleteSchool(listId, setModal, schoolList, setSchoolList);
  }
  // edit School
  function handleEditSchool(data) {
    editSchool(listId, data, setDrawer, setSchoolList, setIsLoading, reset);
  }

  UseShortKey(setDrawer);
  const { query, setQuery, filteredData } = UseFilter(schoolList, "schoolName");
  function onChangeStatus(isActive, id) {
    setTpLoader(true);
    editSchool(id, { isActive }, setDrawer, setSchoolList, setIsLoading, reset);
    setTpLoader(false);
  }
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
                  setIsEditing(false);
                  setDrawer(true);
                }}
                className={`btn group  btn-primary md:w-full`}
              >
                <LuPlus className="h-4 w-4 group-hover:fill-white transition-none" />
                {`Create Organization`}
              </button>
            </Tippy>
          </div>
        </div>
      </div>
      <SchoolListTable
        onEditClick={onEditClick}
        onDeleteClick={onDeleteClick}
        data={filteredData}
        onChangeStatus={onChangeStatus}
      />
      <DrawerComponent
        size={"900px"}
        title={`${!isEditing ? "Add New" : "Update"} Organization`}
        open={drawer}
        setOpen={setDrawer}
        body={
          <>
            <form onSubmit={handleSubmit(handleCreateSchool)}>
              <div className="grid grid-cols-3 sm:grid-cols-2 gap-6 lg:gap-5 pt-4">
                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("schoolName")}
                  />
                  <label htmlFor={"id"}>
                    Organization Name <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox ">
                  <input
                    required
                    type={"email"}
                    className={`formControl `}
                    {...register("schoolEmail")}
                  />
                  <label htmlFor={"id"}>
                    Organization Email Address{" "}
                    <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="box">
                  <div className="inputBox ">
                    <input
                      required
                      type={"number"}
                      className={`formControl `}
                      {...register("schoolContact", {
                        minLength: 10,
                        maxLength: 10,
                      })}
                    />
                    <label htmlFor={"id"}>
                      Organization Mobile Number{" "}
                      <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  {(errors?.schoolContact &&
                    errors.schoolContact?.type === "minLength") ||
                    (errors.schoolContact?.type === "maxLength" && (
                      <p className="inputWarning">
                        Please enter a valid mobile number
                      </p>
                    ))}
                </div>
                <div className="inputBox col-span-3 sm:col-span-2">
                  <input
                    required
                    type={"textarea"}
                    className={`formControl `}
                    {...register("address")}
                  />
                  <label htmlFor={"id"}>
                    Organization Address{" "}
                    <span className="text-red-600"> *</span>
                  </label>
                </div>

                <div className="inputBox ">
                  <select
                    className="formControl"
                    id="country"
                    name="country"
                    required
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                    }}
                  >
                    <option disabled>--Select State--</option>
                    {stateList?.map((item) => {
                      if (selectedState === `${item.SName}-${item.id}`) {
                        return (
                          <option
                            selected
                            key={item.id}
                            value={`${item.SName}-${item.id}`}
                          >
                            {item.SName}
                          </option>
                        );
                      } else {
                        return (
                          <option
                            key={item.id}
                            value={`${item.SName}-${item.id}`}
                          >
                            {item.SName}
                          </option>
                        );
                      }
                    })}
                  </select>
                  <label htmlFor={"id"}>
                    Select State <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="inputBox ">
                  <select
                    className="formControl"
                    id="country"
                    name="country"
                    required
                    {...register("district")}
                  >
                    <option value="" disabled>
                      --Select District--
                    </option>
                    {districtList?.map((item) => {
                      return (
                        <option
                          key={item.id}
                          value={`${item.DistrictName}-${item.id}`}
                        >
                          {item.DistrictName}
                        </option>
                      );
                    })}
                  </select>
                  <label htmlFor={"id"}>
                    Select District <span className="text-red-600"> *</span>
                  </label>
                </div>

                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("contactPersonName")}
                  />
                  <label className="pr-5" htmlFor={"id"}>
                    Contact Person <span className="text-red-600"> *</span>
                  </label>
                </div>
              </div>
              <h4 className="LoginDetails mt-3 mb-5 font-semibold">
                Login Details
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-2 gap-6 lg:gap-5 ">
                <div className="inputBox ">
                  <input
                    required
                    type={"text"}
                    className={`formControl `}
                    {...register("name")}
                  />
                  <label htmlFor={"id"}>
                    Name <span className="text-red-600"> *</span>
                  </label>
                </div>
                <div className="box">
                  <div className="inputBox ">
                    <input
                      required
                      type={"number"}
                      className={`formControl `}
                      {...register("contact", {
                        minLength: 10,
                        maxLength: 10,
                      })}
                    />
                    <label htmlFor={"id"}>
                      Mobile Number <span className="text-red-600"> *</span>
                    </label>
                  </div>
                  {(errors.contact && errors.contact?.type === "minLength") ||
                    (errors.contact?.type === "maxLength" && (
                      <p className="inputWarning">
                        Please enter a valid mobile number
                      </p>
                    ))}
                </div>
                <div className="inputBox ">
                  <input
                    required
                    type={"email"}
                    className={`formControl `}
                    {...register("email")}
                  />
                  <label htmlFor={"id"}>
                    Email Address <span className="text-red-600"> *</span>
                  </label>
                </div>

                {!isEditing && (
                  <>
                    {" "}
                    <div className="inputBox">
                      <input
                        required={!isEditing}
                        type={isShow.pass ? "text" : "password"}
                        className={`formControl notRequired`}
                        onChange={(e) => {
                          setPassword((prev) => {
                            return { ...prev, password: e.target.value };
                          });
                        }}
                        value={password.password}
                        onFocus={notRequiredInput}
                        onBlurCapture={inputBlur}
                      />
                      <label htmlFor={"password"}>
                        Password
                        <span className="text-red-600"> *</span>
                      </label>

                      <div
                        onClick={() => {
                          setIsShow({ ...isShow, pass: !isShow.pass });
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                      >
                        {isShow.pass ? <VscEye /> : <VscEyeClosed />}
                      </div>
                    </div>
                    <div className="box">
                      <div className="inputBox">
                        <input
                          required={!isEditing}
                          type={isShow.conPass ? "text" : "password"}
                          className={`formControl notRequired`}
                          onFocus={notRequiredInput}
                          onBlurCapture={inputBlur}
                          onChange={(e) => {
                            setPassword((prev) => {
                              return { ...prev, conPassword: e.target.value };
                            });
                          }}
                        />
                        <label htmlFor={"password2"}>
                          Confirm Password
                          <span className="text-red-600"> *</span>
                        </label>

                        <div
                          onClick={() => {
                            setIsShow({
                              ...isShow,
                              conPass: !isShow.conPass,
                            });
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
                        >
                          {isShow.pass ? <VscEye /> : <VscEyeClosed />}
                        </div>
                      </div>

                      {password.error && (
                        <p className="inputWarning">Passwords do not match</p>
                      )}
                    </div>
                  </>
                )}
              </div>

              <button
                disabled={isLoading}
                className={` ${
                  isLoading ? "cursor-not-allowed" : ""
                } btn ms-auto btn-primary mt-4 `}
              >
                {isLoading ? <LoaderSpiner /> : "Save"}
              </button>
            </form>
          </>
        }
      />
      <CustomModal
        onConfirm={handleDeleteSchool}
        open={modal}
        setOpen={setModal}
        isHeader={false}
        loading={isLoading}
        body={<ConfirmModal />}
      />
    </>
  );
}

export default School;
