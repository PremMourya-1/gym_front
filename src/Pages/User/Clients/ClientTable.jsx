import Table from "../../../Components/Table/Table";
import moment from "moment/moment";
import toCamelCase from "../../../Utils/modifyString";
import ActionDropDown from "../../../Components/Common/ActionButtons/ActionDropDown";
import { MdLoop } from "react-icons/md";
import { DATE_MONTH_FORMATE } from "../../../Utils/formateDate";
import { Link } from "react-router-dom";
import Switch from "../../../Components/Switch";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
import { COMMON_IMAGE_URL } from "../../../Service/service";
import { useState } from "react";

function ClientTable({
  data,
  onEditClick,
  onChangeStatus,
  paginate,
  onDeleteClick,
  onRenewalClick,
  isPending,
  onClearPending,
  onUploadPhotoClick,
}) {
  const [previewImg, setPreviewImg] = useState(null);
  const columnsData = [
    {
      title: "Client",
      width: "200px",
      selector: (row) => {
        const name = toCamelCase(row.clientName);

        return (
          <Link to={`/clients/${row.id}`} className="flex items-center gap-3">
            {/* 🔥 Avatar */}
            {row.photo ? (
              <img
                src={`${COMMON_IMAGE_URL}${row.photo}`}
                alt={name}
                className="w-10 h-10 rounded-full object-cover border"
                onClick={(e) => {
                  e.preventDefault(); // link click stop
                  setPreviewImg(`${COMMON_IMAGE_URL}${row.photo}`);
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold">
                {name?.charAt(0)}
              </div>
            )}

            {/* 🔥 Name */}
            <span className="text-blue-500 hover:underline">{name}</span>
          </Link>
        );
      },
    },
    {
      title: "Mobile No",
      selector: (row) => row.mobileNo,
    },
    {
      title: "Plan",
      selector: (row) => toCamelCase(row.plan?.name),
    },
    {
      title: "Plan Price",
      width: "100px",

      selector: (row) => `₹ ${row.plan?.amount}`,
    },
    {
      title: "Client Paid",
      width: "100px",
      selector: (row) => (
        <span className="text-green-700">
          ₹ {row?.paidAmount || row.plan?.amount}
        </span>
      ),
    },
    {
      title: "Discount",
      width: "100px",
      selector: (row) => (
        <span className="text-red-700">₹ {row?.discountAmount || 0}</span>
      ),
    },
    {
      title: "Pending",
      width: "100px",
      selector: (row) => (
        <span className="text-red-700">₹ {row?.pendingAmount || 0}</span>
      ),
    },
    {
      title: "Total Pending",
      width: "100px",
      selector: (row) => (
        <span className="text-red-700">₹ {row?.totalPendingAmount || 0}</span>
      ),
    },
    {
      title: "Last Renewal",
      width: "120px",
      selector: (row) =>
        row.lastRenewalDate
          ? moment(row.lastRenewalDate).format("D MMM YYYY")
          : "-",
    },

    // 🔥 SINGLE FIELD LOGIC
    {
      title: "Expire ?",
      width: "120px",
      selector: (row) => {
        const date = moment(row.expiryDate).format(DATE_MONTH_FORMATE);

        return row.expired < 0 ? (
          <div className="text-red-600">
            <div className="font-medium text-sm">{date}</div>
            <div className="text-xs">{Math.abs(row.expired)} days ago</div>
          </div>
        ) : row.expired === 0 ? (
          <div className="text-orange-500">
            <div className="font-medium text-sm">{date}</div>
            <div className="text-xs">Expiring Today</div>
          </div>
        ) : (
          <div className="text-yellow-600">
            <div className="font-medium text-sm">{date}</div>
            <div className="text-xs">{row.expired} days left</div>
          </div>
        );
      },
    },
    // ❌ hide active toggle for expired page only
    {
      title: "Active",
      selector: (row) => (
        <Switch
          item={row}
          onChangeStatus={onChangeStatus}
          checked={Boolean(row.active)}
          type={"active"}
        />
      ),
    },

    // ❌ hide actions for expired page only
    {
      title: "Action",
      width: "40px",
      fixed: "right",
      selector: (item) => (
        <ActionDropDown
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
          row={item}
          title="Client"
        >
          {item.expired < 0 && (
            <li
              className="flex border-b items-center gap-2 hover:bg-[var(--info)] px-2 py-1.5 hover:text-[var(--text-white)] dark:!text-white cursor-pointer"
              onClick={() => {
                onRenewalClick(item);
              }}
            >
              <MdLoop className=" text-lg" />
              renew Plan
            </li>
          )}
          {isPending && (
            <li
              className="flex border-b items-center gap-2 hover:bg-[var(--info)] px-2 py-1.5 hover:text-[var(--text-white)] dark:!text-white cursor-pointer"
              onClick={() => {
                onClearPending(item);
              }}
            >
              <IoMdCheckmarkCircleOutline className=" text-lg" />
              Clear Pendings
            </li>
          )}
          <li
            className="flex border-b items-center gap-2 hover:bg-[var(--info)] px-2 py-1.5 hover:text-[var(--text-white)] dark:!text-white cursor-pointer"
            onClick={() => {
              onUploadPhotoClick(item);
            }}
          >
            <IoCameraOutline className=" text-lg" />
            Upload Photo
          </li>
        </ActionDropDown>
      ),
    },
  ].filter(Boolean);

  return (
    <>
      <Table
        columns={columnsData}
        data={data}
        page={paginate.page}
        limit={paginate.limit}
      />
      {previewImg && (
        <div className="fixed inset-0 z-50 flex border border-color items-center justify-center bg-black/70">
          {/* ❌ Close on background click */}
          <div
            className="absolute inset-0"
            onClick={() => setPreviewImg(null)}
          />

          {/* 🔥 Image Box */}
          <div className="relative z-10">
            {/* ❌ Close button */}
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute -top-3 -right-3 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow"
            >
              ✖
            </button>

            {/* 🖼️ Square Image */}
            <img
              src={previewImg}
              alt="preview"
              className="w-72 h-72 object-cover rounded-xl shadow-xl"
            />

            {/* 👉 Circle version (agar chahiye to ye use kar)
      <img
        src={previewImg}
        alt="preview"
        className="w-72 h-72 object-cover rounded-full shadow-xl"
      />
      */}
          </div>
        </div>
      )}
    </>
  );
}

export default ClientTable;
