import { useEffect, useState } from "react";
import getUserPlanDetails from "./userDetailService";
import { useNavigate, useParams } from "react-router";
import UserDetailTable from "./UserDetailTable";
// import Image from "../../../Components/Common/Image/Image";
import formatDate from "../../../Utils/formateDate";

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [planDetails, setPlanDetails] = useState({});
  useEffect(() => {
    getUserPlanDetails(id, setPlanDetails, navigate);
  }, []);

  return (
    <>
      <div className="card p-3 ">
        <div className=" flex gap-6 sm:flex-col mb-4">
          {/* <div className="relative  studentProfilePicture  h-36 w-36 shrink-0 rounded-md border  dark:border-gray-500">
            <Image
              url={planDetails?.logo}
              alt={"student_profile"}
              className={"rounded-md"}
            />
          </div> */}
          <div className="grid w-full grid-cols-4 gap-6 py-4 lg:grid-cols-2 md:grid-cols-1">
            <div className="inputBox">
              <input
                type="text"
                className="formControl active "
                value={planDetails?.name}
                disabled
              />
              <label> Name</label>
            </div>
            <div className="inputBox">
              <input
                type="text"
                className="formControl active"
                value={planDetails?.schoolName}
                required
                disabled
              />
              <label>School Name</label>
            </div>
            <div className="inputBox">
              <input
                type="text"
                className="formControl active"
                value={planDetails?.contact}
                required
                disabled
              />
              <label>Mobile No</label>
            </div>
            <div className="inputBox">
              <input
                type="text"
                className="formControl active"
                value={planDetails?.email}
                required
                disabled
              />
              <label>Email</label>
            </div>
            <div className="inputBox">
              <input
                type="text"
                className="formControl active"
                value={planDetails?.state}
                required
                disabled
              />
              <label>State</label>
            </div>
            <div className="inputBox">
              <input
                type="text"
                className="formControl active"
                value={planDetails?.district}
                required
                disabled
              />
              <label>State</label>
            </div>
            <div className="inputBox">
              <input
                type="text"
                className="formControl active"
                value={formatDate(planDetails?.expDate)}
                required
                disabled
              />
              <label>Expire Date</label>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <UserDetailTable data={planDetails?.studentPlans} />
      </div>
    </>
  );
}

export default UserDetail;
