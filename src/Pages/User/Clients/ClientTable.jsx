import Table from "../../../Components/Table/Table";
import moment from "moment/moment";
import toCamelCase from "../../../Utils/modifyString";
import ActionDropDown from "../../../Components/Common/ActionButtons/ActionDropDown";
import { MdLoop } from "react-icons/md";
import formatDate, { DATE_MONTH_FORMATE } from "../../../Utils/formateDate";
import { Link } from "react-router-dom";
import Switch from "../../../Components/Switch";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoCameraOutline } from "react-icons/io5";
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
                src={`${row.photo}`}
                alt={name}
                className="w-10 h-10 rounded-full object-cover border border-color"
                onClick={(e) => {
                  e.preventDefault(); // link click stop
                  setPreviewImg(`${row.photo}`);
                }}
              />
            ) : (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUploadPhotoClick(row);
                }}
                className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold"
              >
                {name?.charAt(0)}
              </div>
            )}

            {/* 🔥 Name */}
            <span className=" hover:underline">{name}</span>
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
      width: "110px",
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
      width: "120px",
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
        const offerName = toCamelCase(row.offerName || row.offer?.name);
        const offerStart = formatDate(
          row.offerStartDate ||
            row.offer?.offerStartDate ||
            row.offer?.startDate,
        );
        const offerEnd = formatDate(
          row.offerEndDate || row.offer?.offerEndDate || row.offer?.endDate,
        );
        const offerDays = row.days ?? row.offer?.days ?? row.offer?.extraDays;
        const planDuration = row.plan?.duration
          ? `${row.plan.duration} Month${row.plan.duration > 1 ? "s" : ""}`
          : null;
        const hasOffer = Boolean(row.offer?.id);

        const content =
          row.expired < 0 ? (
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

        return (
          <div className="relative group">
            <div className="flex items-center gap-2">
              {hasOffer && (
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              )}
              {content}
            </div>
            {hasOffer && (
              <div className="offerbox text-xs invisible opacity-0 group-hover:visible group-hover:opacity-100 pointer-events-none absolute left-1/2 -translate-x-1/2 top-full z-50 mt-2 w-[240px] rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] overflow-hidden text-[12px] text-[color:var(--text)] shadow-lg transition-all duration-200 dark:border-[color:var(--border)] dark:bg-[color:var(--background-dark)] dark:text-[color:var(--text-white)]">
                {offerName && (
                  <div className="  text-[color:var(--primary)] items-center justify-between  bg-[color:var(--primary-tp)] px-3 py-2 text-sm ">
                    <span className="font-medium text-green-500">Offer</span>
                    <p className="text-xs">{offerName}</p>
                  </div>
                )}
                <div className="space-y-1.5 p-2">
                  {offerStart && (
                    <div className="flex rounded-md  items-center justify-between  bg-[color:var(--background-light)] px-3 py-2 ">
                      <span className="font-medium text-[color:var(--text-light)]">
                        Valid From
                      </span>
                      <span className="text-[color:var(--text)] dark:text-[color:var(--text-white)]">
                        {offerStart}
                      </span>
                    </div>
                  )}
                  {offerEnd && (
                    <div className="flex rounded-md  items-center justify-between  bg-[color:var(--background-light)] px-3 py-2 ">
                      <span className="font-medium text-[color:var(--text-light)]">
                        Valid Till
                      </span>
                      <span className="text-[color:var(--text)] dark:text-[color:var(--text-white)]">
                        {offerEnd}
                      </span>
                    </div>
                  )}
                  {planDuration && (
                    <div className="flex rounded-md  items-center justify-between  bg-[color:var(--background-light)] px-3 py-2 ">
                      <span className="font-medium text-[color:var(--text-light)]">
                        Without Offer
                      </span>
                      <span className="text-[color:var(--text)] dark:text-[color:var(--text-white)]">
                        {planDuration}
                      </span>
                    </div>
                  )}
                  <div className="flex rounded-md items-center justify-between  bg-[color:var(--background-light)] px-3 py-2 ">
                    <span className="font-medium text-[color:var(--text-light)]">
                      Offer Days
                    </span>
                    <span className="text-[color:var(--text)] dark:text-[color:var(--text-white)]">
                      {offerDays ? `${offerDays} Days` : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            )}
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
              className="flex  items-center gap-2 hover:bg-[var(--info)] px-2 py-1.5 hover:text-[var(--text-white)] dark:!text-white cursor-pointer"
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
              className="flex  items-center gap-2 hover:bg-[var(--info)] px-2 py-1.5 hover:text-[var(--text-white)] dark:!text-white cursor-pointer"
              onClick={() => {
                onClearPending(item);
              }}
            >
              <IoMdCheckmarkCircleOutline className=" text-lg" />
              Clear Pendings
            </li>
          )}
          <li
            className="flex  items-center gap-2 hover:bg-[var(--info)] px-2 py-1.5 hover:text-[var(--text-white)] dark:!text-white cursor-pointer"
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
