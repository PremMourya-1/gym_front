import { BiSolidDashboard } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { IoLayers } from "react-icons/io5";
import { MdCategory } from "react-icons/md";

const SideBarData = [
  {
    link: "/",
    title: "dashboard",
    icon: <BiSolidDashboard className="text-xl" />,
    content: [],
  },
  {
    link: "#",
    title: "clients",
    icon: <FaUsers className="text-xl" />,
    content: [
      { title: "All Clients", link: "/clients/all", key: "all" },
      { title: "Expired Clients", link: "/clients/expired", key: "expired" },
      { title: "deactive Clients", link: "/clients/deactive", key: "deactive" },
      { title: "pending payments", link: "/clients/pending-payments", key: "pending payments" },
    ],
  },
  {
    link: "/plans",
    title: "plans",
    icon: <IoLayers className="text-xl" />,
    content: [],
  },
  {
    link: "/features",
    title: "features",
    icon: <MdCategory className="text-xl" />,
    content: [],
  },
];

export default SideBarData;
