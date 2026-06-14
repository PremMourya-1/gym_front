import { useSelector } from "react-redux";
import { getLoggedInUserDetails } from "../../../Store/Slices/AuthSlice";

import {
  RiCalendarLine,
  RiTimeLine,
  RiVipCrownLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiUserLine,
  RiShieldCheckLine,
} from "react-icons/ri";

import Card from "../../../Components/Card/Card";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import { useEffect, useState } from "react";

function GymProfile() {
  const [gymData, setGymData] = useState();
  console.log(gymData);

  const gymStoredDAta = useSelector(getLoggedInUserDetails);

  useEffect(() => {
    setGymData(gymStoredDAta);
  }, [gymStoredDAta]);

  const planEndDate = gymData?.planEndDate;
  // registration date
  const registrationDate = new Date(gymData?.createdAt);

  // expiry date
  const expiryDate = new Date(gymData?.planEndDate);

  expiryDate.setMonth(expiryDate.getMonth() + gymData?.planData?.duration);

  // days left
  const today = new Date();

  // const remainingTime = expiryDate - today;

  const remainingDays = planEndDate
    ? Math.max(
        Math.ceil((new Date(planEndDate) - today) / (1000 * 60 * 60 * 24)),
        0,
      )
    : null;

  // format date
  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return gymData ? (
    <>
      <div className="breadcrumbAndButton">
        <BreadCrumb
          title={"Gym Profile"}
          content={[{ title: "Gym Profile", slug: "#" }]}
        />
      </div>
      <div className="grid md:grid-cols-1 grid-cols-3 gap-4">
        {/* left profile */}
        <Card shadow className="h-max p-6 w-full md:col-span-2">
          <div className="flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-primary flex-center text-white text-3xl font-bold shrink-0">
              {gymData.gymName?.charAt(0)}
            </div>

            <h2 className="text-2xl font-bold mt-3 capitalize break-words">
              {gymData.gymName}
            </h2>

            <p className="text-light text-sm break-all">@{gymData.username}</p>

            <div
              className={`mt-3 px-4 py-1 rounded-full text-sm font-semibold ${
                gymData.status
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {gymData.status ? "Active Account" : "Inactive"}
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex items-start gap-3">
              <RiUserLine size={18} className="text-primary mt-1 shrink-0" />

              <div className="min-w-0">
                <p className="text-light text-sm">Owner Name</p>

                <h4 className="font-semibold break-words">
                  {gymData.ownerName}
                </h4>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RiPhoneLine size={18} className="text-primary mt-1 shrink-0" />

              <div className="min-w-0">
                <p className="text-light text-sm">Phone</p>

                <h4 className="font-semibold break-all">{gymData.phone}</h4>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RiMailLine size={18} className="text-primary mt-1 shrink-0" />

              <div className="min-w-0">
                <p className="text-light text-sm">Email</p>

                <h4 className="font-semibold break-all">{gymData.email}</h4>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RiMapPinLine size={18} className="text-primary mt-1 shrink-0" />

              <div className="min-w-0">
                <p className="text-light text-sm">Location</p>

                <h4 className="font-semibold capitalize break-words">
                  {gymData.address}, {gymData.city}, {gymData.state}
                </h4>
              </div>
            </div>
          </div>
        </Card>

        {/* right details */}
        <div className="col-span-2 space-y-4">
          {/* plan details */}
          <Card shadow className="w-full ">
            <div className="flex items-center gap-2 mb-5">
              <RiVipCrownLine className="text-primary shrink-0" size={22} />

              <h2 className="text-lg sm:text-xl font-bold">
                Subscription Details
              </h2>
            </div>

            <div className="grid sm:grid-cols-1 grid-cols-2 gap-4">
              <div className="bg-light rounded-lg p-4">
                <p className="text-light text-sm">Current Plan</p>

                <h3 className="text-lg sm:text-xl font-bold capitalize mt-1">
                  {gymData?.planData?.name}
                </h3>
              </div>

              <div className="bg-light rounded-lg p-4">
                <p className="text-light text-sm">Plan Duration</p>

                <h3 className="text-lg sm:text-xl font-bold mt-1">
                  {gymData?.planData?.duration} Month
                </h3>
              </div>

              {/* <div className="bg-light rounded-lg p-4">
                <p className="text-light text-sm">Plan Start Date</p>

                <h3 className="text-base sm:text-lg font-bold mt-1">
                  {formatDate(planStartDate)}
                </h3>
              </div> */}

              <div className="bg-light rounded-lg p-4">
                <p className="text-light text-sm">Plan Expiry Date</p>

                <h3 className="text-base sm:text-lg font-bold mt-1">
                  {formatDate(expiryDate)}
                </h3>
              </div>

              <div className="bg-light rounded-lg p-4">
                <p className="text-light text-sm">Remaining Days</p>

                <h3
                  className={`text-lg sm:text-xl font-bold mt-1 ${
                    remainingDays <= 5 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {remainingDays} Days Left
                </h3>
              </div>

              <div className="bg-light rounded-lg p-4">
                <p className="text-light text-sm">Plan Amount</p>

                <h3 className="text-lg sm:text-xl font-bold mt-1">
                  ₹ {gymData.planData.amount}
                </h3>
              </div>
            </div>
          </Card>
          {/* account details */}
          <Card shadow>
            <div className="flex items-center gap-2 mb-5">
              <RiShieldCheckLine className="text-primary shrink-0" size={22} />

              <h2 className="text-lg sm:text-xl font-bold">
                Account Information
              </h2>
            </div>

            <div className="grid md:grid-cols-1 grid-cols-2 gap-4">
              <div className="bg-light rounded-lg p-4">
                <p className="text-light text-sm">Registration Date</p>

                <h3 className="font-bold mt-1 flex items-center gap-2 text-sm sm:text-base">
                  <RiCalendarLine size={18} />

                  {formatDate(registrationDate)}
                </h3>
              </div>

              <div className="bg-light rounded-lg p-4">
                <p className="text-light text-sm">Last Updated</p>

                <h3 className="font-bold mt-1 flex items-center gap-2 text-sm sm:text-base">
                  <RiTimeLine size={18} />

                  {formatDate(new Date(gymData.updatedAt))}
                </h3>
              </div>

              <div className="bg-light rounded-lg p-4 sm:col-span-2">
                <p className="text-light text-sm">Gym ID</p>

                <h3 className="font-semibold mt-1 break-all text-sm">
                  {gymData.id}
                </h3>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  ) : (
    "loading"
  );
}

export default GymProfile;
