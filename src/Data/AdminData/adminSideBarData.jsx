import { CgGym } from "react-icons/cg";
import { FaAddressBook } from "react-icons/fa6";

const adminSideBarData = [
  {
    link: "/admin",
    title: "dashboard",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M11 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H11V21ZM13 21H19C20.1 21 21 20.1 21 19V12H13V21ZM21 10V5C21 3.9 20.1 3 19 3H13V10H21Z" />
      </svg>
    ),
    content: [],
  },

  {
    link: "/admin/gym",
    title: "gym",
    matcher: "",
    icon: <CgGym className="text-xl" />,
    content: [],
  },
  {
    link: "/admin/plans",
    title: "plans",
    matcher: "",
    icon: <FaAddressBook className="text-xl" />,
    content: [],
  },
];

export default adminSideBarData;
