import Table from "../../../Components/Table/Table";
import formatDate from "../../../Utils/formateDate";
import { MdReplyAll } from "react-icons/md";
import { IoTrashBin } from "react-icons/io5";
import Tippy from "@tippyjs/react";
import { BiSolidEditAlt } from "react-icons/bi";
import { FiDownload } from "react-icons/fi";
import { COMMON_IMAGE_URL } from "../../../Service/service";

function TicketTable({ data, onEditClick, isAdmin, onDeleteClick }) {
  // const handleDownload = (attachment) => {
  //   const correctedPath = attachment.replace(/\\/g, "/");
  //   const fileURL = `${COMMON_IMAGE_URL}${correctedPath}`;

  //   const link = document.createElement("a");
  //   link.href = fileURL;
  //   link.target = "_blank";
  //   link.download = fileURL.split("/").pop();
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const downloadFile = (filePath) => {
    const baseUrl = COMMON_IMAGE_URL; // Replace with your backend base URL
    const fileUrl = `${baseUrl}/${filePath.replace(/\\/g, "/")}`; // Replace backslashes with forward slashes

    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = filePath.split("\\").pop(); // Extract file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const adminColumns = [
    // {
    //   title: "Sr no",
    //   width: "80px",
    //   selector: (_, i) => {
    //     return i + 1;
    //   },
    // },
    {
      title: "Date",
      width: "120px",
      selector: (row) => formatDate(row.messageDate),
    },
    {
      title: "School",
      selector: (row) => row.user?.schoolName,
    },
    {
      title: "School Contact",
      selector: (row) => (
        <div className="text-sm">
          <p>{row.user?.name}</p>
          <p>{row.user?.contact}</p>
          <p>{row.user?.email}</p>
        </div>
      ),
    },
    {
      title: "message",
      selector: (row) => {
        return (
          <div>
            <div className="line-clamp-1 font-semibold flex gap-1">
              <span className="text-primary text-sm shrink-0">Message : </span>
              <Tippy content={row.message}>
                <span className="line-clamp-1">{row.message}</span>
              </Tippy>
            </div>
            <div className="flex gap-1">
              <span className="text-green-600 dark:text-green-500  text-sm shrink-0">
                Reply :
              </span>
              <Tippy content={row.messageReply}>
                <p className="line-clamp-1">{row.messageReply}</p>
              </Tippy>
            </div>
            <span className="text-[10px]">
              {formatDate(row.messageReplyDate)}{" "}
            </span>
          </div>
        );
      },
    },

    {
      title: "Status",
      selector: (row) => {
        return (
          <>
            {row.status === 1 ? (
              <div className="flex gap-2 items-center">
                <p className="h-3 w-3 rounded-full bg-green-600"></p>
                Replied
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <p className="h-3 w-3 rounded-full bg-yellow-500"></p>
                Pending
              </div>
            )}
          </>
        );
      },
    },
    {
      title: "Action",
      width: "30px",
      selector: (row) => {
        return (
          <>
            <div className="flex items-center gap-1">
              <Tippy content={"Reply"}>
                <button
                  className="flex gap-2 items-center font-semibold p-1.5 hover:bg-gray-300 rounded-md dark:hover:bg-gray-900  text-sm cursor-pointer text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                  onClick={() => {
                    onEditClick(row);
                  }}
                >
                  <MdReplyAll className="text-lg text-gray-700 dark:text-gray-200" />
                </button>
              </Tippy>
              <Tippy content={"Delete Record"}>
                <button
                  onClick={() => {
                    onDeleteClick(row);
                  }}
                  className="flex gap-2 items-center font-semibold p-1.5 hover:bg-gray-300 rounded-md dark:hover:bg-gray-900  text-sm cursor-pointer text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  <IoTrashBin className="text-lg fill-red-500 dark:fill-red-500" />
                </button>
              </Tippy>
            </div>
          </>
        );
      },
    },
  ];
  const userColumn = [
    // {
    //   title: "Sr no",
    //   width: "80px",
    //   selector: (_, i) => {
    //     return i + 1;
    //   },
    // },
    {
      title: "Id",
      width: "20px",
      selector: (row) => {
        return row.id;
      },
    },
    {
      title: "Date",
      selector: (row) => formatDate(row.messageDate),
    },
    {
      title: "message",
      selector: (row) => {
        return (
          <div>
            <div className="line-clamp-1 font-semibold flex gap-1">
              <span className="text-primary text-sm shrink-0">Message : </span>
              <Tippy content={row.message}>
                <span className="line-clamp-1">{row.message}</span>
              </Tippy>
            </div>
            <div className="flex gap-1">
              <span className="text-green-600 dark:text-green-500  text-sm shrink-0">
                Reply :
              </span>
              <Tippy content={row.messageReply}>
                <p className="line-clamp-1">{row.messageReply}</p>
              </Tippy>
            </div>
            <span className="text-[10px]">
              {formatDate(row.messageReplyDate)}{" "}
            </span>
          </div>
        );
      },
    },

    {
      title: "Status",
      selector: (row) => {
        return (
          <>
            {row.status === 1 ? (
              <div className="flex gap-2 items-center">
                <p className="h-3 w-3 rounded-full bg-green-600"></p>
                Replied
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <p className="h-3 w-3 rounded-full bg-yellow-500"></p>
                Pending
              </div>
            )}
          </>
        );
      },
    },

    {
      title: "File",
      width: "120px",
      selector: (row) => {
        return (
          <>
            {row.attachment ? (
              <Tippy content="Download Attechment file">
                <button
                  style={{ padding: "6px" }}
                  onClick={() => {
                    // handleDownload(row.attachment);
                    downloadFile(row.attachment);
                  }}
                  className={`btn btn-primary w-8 h-8 ${
                    !row.attachment && "opacity-50 pointer-events-none"
                  }`}
                  // href={`${COMMON_IMAGE_URL}${row.attachment}`}
                  // target="_blank"
                >
                  <FiDownload />
                </button>
              </Tippy>
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      title: "Action",
      width: "30px",
      selector: (row) => {
        return (
          <Tippy content="Send Message">
            <button
              disabled={row.status}
              onClick={() => {
                onEditClick(row);
              }}
              className={row.status ? "cursor-not-allowed opacity-45" : ""}
            >
              <BiSolidEditAlt className="text-xl fill-gray-700 dark:fill-gray-300" />
            </button>
          </Tippy>
        );
      },
    },
  ];
  return (
    <div className="card rounded-lg p-3">
      <Table columns={isAdmin ? adminColumns : userColumn} data={data} />
    </div>
  );
}

export default TicketTable;
