import { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa6";
import DrawerComponent from "../../Drawer/Drawer";
import moment from "moment";
import { GoClock } from "react-icons/go";
import { getLocaleStorageItem } from "../../../Utils/localeStorage";
import { USER_DETAILS } from "../../../Constant/Constant";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Notification() {
  const [placement, setPlacement] = useState("right");
  const [open, setOpen] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [newMessage, setNewMessage] = useState([]);
  const [markedData, setMarkedData] = useState([]);
  const userData = getLocaleStorageItem(USER_DETAILS);
  const [isConnected, setIsConnected] = useState(true);
  const isAdmin = useLocation().pathname.split("/")[1] === "admin";
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={() => {
          isAdmin ? navigate("/admin/ticket") : setOpen(true);
        }}
        className="circle relative h-9 w-9 rounded-full bg-light flex items-center justify-center cursor-pointer"
      >
        <FaBell className={`svgFillLightBg ${shaking ? "shakeBell" : ""}`} />
        {newMessage.length ? (
          <span className="absolute -right-1 -top-1 block h-[16px] w-[16px] text-[12px] rounded-full bg-red-500 textWhite  flex-center">
            {newMessage.length}
          </span>
        ) : (
          ""
        )}
      </div>
      <DrawerComponent
        open={open}
        setOpen={setOpen}
        placeMent={placement}
        setPlacement={setPlacement}
        title={"Notifications"}
        body={
          <>
            {newMessage?.map((item) => {
              return (
                <Link
                  onClick={() => {
                    setOpen(false);
                  }}
                  to={"support/support-ticket"}
                  className={` ${
                    item.isRead ? "opacity-60" : ""
                  } border-b font-medium  text-sm pb-2 dark:border-gray-600 mb-2 block `}
                  key={item.id}
                >
                  <p className="line-clamp-2">
                    <span className="text-primary">Message :</span>{" "}
                    {item.message}
                  </p>
                  <p className="line-clamp-2">
                    <span className="text-green-700 dark:text-green-500">
                      Reply :
                    </span>{" "}
                    {item.messageReply}
                  </p>
                  <span className="text-[10px] font-semibold flex gap-1 justify-end items-center text-green-700 dark:text-green-500">
                    <GoClock className="text-[13px]" />
                    {moment(item.messageReplyDate).format("DD-MM-YYYY")}{" "}
                    {moment(item.messageReplyDate).format("HH:mm")}
                  </span>
                </Link>
              );
            })}
            {markedData?.map((item) => {
              return (
                <Link
                  onClick={() => {
                    setOpen(false);
                  }}
                  to={"support/support-ticket"}
                  className={` ${
                    item.isRead ? "opacity-60" : ""
                  } border-b font-medium  text-sm pb-2 dark:border-gray-600 mb-2 block `}
                  key={item.id}
                >
                  <p className="line-clamp-2">
                    {/* <span className="text-green-700 dark:text-green-500">
                      Reply :
                    </span>{" "} */}
                    {item.messageReply}
                  </p>
                  <span className="text-[10px] font-semibold flex gap-1 justify-end items-center text-green-700 dark:text-green-500">
                    <GoClock className="text-[13px]" />
                    {moment(item.messageReplyDate).format("DD-MM-YYYY")}{" "}
                    {moment(item.messageReplyDate).format("HH:mm")}
                  </span>
                </Link>
              );
            })}
          </>
        }
      />
    </>
  );
}

export default Notification;
