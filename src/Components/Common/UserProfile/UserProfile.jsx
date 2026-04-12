import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { CiLock } from "react-icons/ci";
import { ImUser } from "react-icons/im";

import { MdOutlineLogout, MdOutlineSettings } from "react-icons/md";
import CustomModal from "../../Modal/Modal";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { logout } from "../../../Pages/Admin/Auth/authService";
import { useDispatch, useSelector } from "react-redux";
import ConfirmModal from "../../Modal/ConfirmModal";
import Image from "../Image/Image";
import { Link } from "react-router-dom";
import { getLoggedInUserDetails } from "../../../Store/Slices/AuthSlice";

function UserProfile({ isAdmin, logo }) {
  const userDetails = useSelector(getLoggedInUserDetails);
  console.log(userDetails);
  const disptach = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  function handleLogout() {
    logout(isAdmin, disptach, setIsLoading, navigate);
  }
  const [adminProfile, setAdminProfile] = useState("A");
  const [userProfileText, setUserProfileText] = useState("A");
  useEffect(() => {
    let firstLetter = userDetails?.ownerName?.[0];
    let secondLetter = userDetails?.ownerName?.split(" ")?.[1]?.[0];
    if (!isAdmin) {
      setAdminProfile(userDetails?.ownerName?.[0]);
      if (secondLetter) {
        setUserProfileText(`${firstLetter}${secondLetter}`);
      } else {
        setUserProfileText(firstLetter);
      }
    }
  }, []);
  return (
    <>
      <Menu as="div" className="relative  flex text-left">
        <MenuButton className="">
          <div className="circle  uppercase text-primary text-lg font-bold h-12 w-12 overflow-hidden rounded-full bg-light flex items-center justify-center cursor-pointer">
            {isAdmin && adminProfile}

            {!isAdmin && logo ? (
              <Image url={logo} alt={"A"} />
            ) : (
              userProfileText
            )}
          </div>
        </MenuButton>

        <MenuItems
          transition
          className="data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in absolute right-7 top-10 z-10 mt-4 w-max origin-top-right divide-y divide-gray-100 rounded-lg bg-[var(--background)] shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none ] font-semibold  border border-[color:var(--primary-dark)]  border-none overflow-hidden"
        >
          <div className="">
            <MenuItem className="dropdownLink hover:bg-[var(--primary-tp)] hover:text-primary border-b border-color cursor-pointer  p-2 flex items-center gap-2">
              <span
                onClick={() => {
                  setModal(true);
                }}
              >
                <span className="text-lg ">
                  <ImUser />
                </span>
                My Profile
              </span>
            </MenuItem>
            <MenuItem className="dropdownLink hover:bg-[var(--primary-tp)] hover:text-primary border-b border-color cursor-pointer  p-2 flex items-center gap-2">
              <Link to={`/change-password`}>
                <CiLock size={20} />
                Change Password
              </Link>
            </MenuItem>
            <MenuItem className="dropdownLink hover:bg-[var(--primary-tp)] hover:text-primary border-b border-color cursor-pointer  p-2 flex items-center gap-2">
              <Link to={`/app-settings`}>
                <MdOutlineSettings size={20} />
                App Settings
              </Link>
            </MenuItem>
            <MenuItem className="dropdownLink text-red-500 hover:bg-[var(--primary-tp)] hover:text-primary border-b border-color cursor-pointer  p-2 flex items-center gap-2">
              <span
                onClick={() => {
                  setModal(true);
                }}
              >
                <span className="text-lg ">
                  <MdOutlineLogout />
                </span>
                Log out
              </span>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>

      <CustomModal
        onConfirm={handleLogout}
        open={modal}
        setOpen={setModal}
        isHeader={false}
        size={"460px"}
        loading={isLoading}
        body={
          <>
            <ConfirmModal message={" Are you sure want's  to log out?"} />
          </>
        }
      />
    </>
  );
}

export default UserProfile;
