import { useDispatch, useSelector } from "react-redux";
import formatDate from "../../../Utils/formateDate";
import { useState } from "react";
import updateProfile from "./profileService";
import { IoIosCamera } from "react-icons/io";
import Image from "../../../Components/Common/Image/Image";

function Profile() {
  const profile = useSelector((state) => state.auth?.user);
  const [photo, setPhoto] = useState();

  const dispatch = useDispatch();
  function handleProfile(e) {
    updateProfile(e.target.files[0], setPhoto, dispatch);
  }

  return (
    <>
      <div className="card p-3 flex gap-6 sm:flex-col">
        <div className="relative  studentProfilePicture  h-36 w-36 shrink-0 rounded-md border  dark:border-gray-500">
          <Image
            url={photo ? photo : profile?.logo}
            alt={"school_logo"}
            className={"rounded-md"}
          />

          <input
            type="file"
            className=" opacity-0 scale-0"
            onChange={handleProfile}
            id="profile"
          />
          <label
            htmlFor="profile"
            className={` ${
              photo || profile?.logo ? "opacity-40 hover:opacity-100" : ""
            }  cursor-pointer absolute left-0 z-10 flex-col w-full bottom-0 flex items-center justify-center bg-gray-200  dark:bg-gray-600`}
          >
            <IoIosCamera className="text-xl " />
            <span className="text-[10px]">Update Logo</span>
          </label>
        </div>
        <div className="grid w-full grid-cols-4 gap-6 py-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
          <div className="inputBox">
            <input
              type="text"
              className="formControl active "
              value={profile?.name}
              disabled
            />
            <label> Name</label>
          </div>
          <div className="inputBox">
            <input
              type="text"
              className="formControl active"
              value={profile?.schoolName}
              required
              disabled
            />
            <label>School Name</label>
          </div>
          <div className="inputBox">
            <input
              type="text"
              className="formControl active"
              value={profile?.mobileNo}
              required
              disabled
            />
            <label>Mobile No</label>
          </div>
          <div className="inputBox">
            <input
              type="text"
              className="formControl active"
              value={profile?.email}
              required
              disabled
            />
            <label>Email</label>
          </div>
          <div className="inputBox">
            <input
              type="text"
              className="formControl active"
              value={formatDate(profile?.expDate)}
              required
              disabled
            />
            <label>Plan Expiry Date</label>
          </div>
          <div className="inputBox">
            <input
              type="text"
              className="formControl active"
              value={profile?.studentCount + " Students"}
              required
              disabled
            />
            <label>Limit</label>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
