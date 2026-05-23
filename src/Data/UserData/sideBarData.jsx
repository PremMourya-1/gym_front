import { BiSolidDashboard } from "react-icons/bi";
import { FaUsers, FaRegListAlt, FaUpload, FaCogs } from "react-icons/fa";
import { IoLayers } from "react-icons/io5";
import { MdLocalOffer, MdSubscriptions } from "react-icons/md";

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
      {
        title: "All Clients",
        link: "/clients/all",
        key: "all",
        icon: <FaUsers className="text-base" />,
      },
      {
        title: "Expired Clients",
        link: "/clients/expired",
        key: "expired",
        icon: <FaRegListAlt className="text-base" />,
      },
      {
        title: "deactive Clients",
        link: "/clients/deactive",
        key: "deactive",
        icon: <FaRegListAlt className="text-base" />,
      },
      {
        title: "pending payments",
        link: "/clients/pending-payments",
        key: "pending payments",
        icon: <FaRegListAlt className="text-base" />,
      },
    ],
  },
  {
    link: "/bulk-upload-members",
    title: "bulk-upload-members",
    icon: <FaUpload className="text-xl" />,
    content: [],
  },
  {
    link: "/membership-plans",
    title: "membership-plans",
    icon: <IoLayers className="text-xl" />,
    content: [],
  },
  {
    link: "/offers",
    title: "offers",
    icon: <MdLocalOffer className="text-xl" />,
    content: [],
  },
  {
    link: "/subscription-plans",
    title: "subscription-plans",
    icon: <MdSubscriptions className="text-xl" />,
    content: [],
  },

  {
    link: "/features",
    title: "features",
    icon: <FaCogs className="text-xl" />,
    content: [],
  },
];

export default SideBarData;
