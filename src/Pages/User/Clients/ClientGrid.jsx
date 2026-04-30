import moment from "moment";
import Card from "../../../Components/Card/Card";
import Button from "../../../Components/Button/Button";
import { FaRegEdit } from "react-icons/fa";
import { FiTrash2 } from "react-icons/fi";
import { HiOutlineCamera } from "react-icons/hi";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { MdLoop } from "react-icons/md";
import ClientShimmer from "./ClientShimmer";

function ClientGrid({
  data,
  onEditClick,
  onDeleteClick,
  onRenewalClick,
  onUploadPhotoClick,
  onClearPending,
  isPending,
}) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-4">
      {/* <ClientShimmer /> */}
      {data
        ? data?.map((client) => (
            <Card
              key={client.id}
              className="!p-0 overflow-hidden border border-color bg-[var(--background)] dark:bg-[var(--card-dark)] hover:shadow-lg transition-all duration-300"
            >
              {/* 🔥 IMAGE (NO PADDING, EDGE TO EDGE) */}
              <div className="w-full h-56 md:h-64 relative">
                <img
                  src={
                    client.photo ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="client"
                  className="w-full h-full object-cover"
                />

                {/* 🔥 EXPIRED RIBBON */}
                {client.expired < 0 && (
                  <div className="absolute top-3 -right-8 rotate-45 bg-[var(--danger)] text-white text-[10px] px-10 py-1 font-semibold shadow">
                    EXPIRED
                  </div>
                )}
              </div>

              {/* 🔥 CONTENT */}
              <div className="p-4">
                {/* Name + Plan */}
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-[15px] capitalize text-[var(--text)]">
                    {client.clientName}
                  </h3>

                  <span className="text-[11px] px-2 py-1 rounded-md bg-[var(--primary-tp)] text-[var(--primary)] font-medium capitalize">
                    {client.plan?.name || "No Plan"}
                  </span>
                </div>

                {/* Mobile */}
                <p className="text-xs text-[var(--text-light)] mt-1">
                  {client.mobileNo}
                </p>

                {/* Dates */}
                <p className="text-xs mt-2 text-[var(--muted)]">
                  Joined: {moment(client.joiningDate).format("DD MMM YYYY")}
                </p>

                {/* Expiry Info */}
                <div className="mt-1 text-xs">
                  {client.expired < 0 ? (
                    <span className="text-[var(--danger)]">
                      {Math.abs(client.expired)} days ago
                    </span>
                  ) : client.expired === 0 ? (
                    <span className="text-[var(--warning)]">
                      Expiring Today
                    </span>
                  ) : (
                    <span className="text-[var(--muted)]">
                      {client.expired} days left
                    </span>
                  )}
                </div>

                {/* Payment */}
                <div className="flex justify-between mt-3 text-xs font-medium">
                  <span className="text-[var(--success)]">
                    ₹{client.paidAmount}
                  </span>
                  <span className="text-[var(--danger)]">
                    ₹{client.pendingAmount}
                  </span>
                </div>

                {/* Divider */}
                <div className="h-[1px] bg-[var(--border)] my-3"></div>

                {/* 🔥 ACTION BUTTON GROUP (TAB STYLE) */}
                <div className="flex justify-between items-center">
                  {/* LEFT GROUP */}
                  <div className="flex border border-color rounded-md overflow-hidden">
                    <button
                      onClick={() => onEditClick(client)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs hover:bg-[var(--background-light)] dark:hover:bg-gray-800 transition border-r border-color"
                    >
                      <FaRegEdit size={13} />
                      Edit
                    </button>

                    <button
                      onClick={() => onDeleteClick(client)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-900/20 transition border-r border-color"
                    >
                      <FiTrash2 size={13} />
                      Delete
                    </button>

                    <button
                      onClick={() => onUploadPhotoClick(client)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs hover:bg-[var(--background-light)] dark:hover:bg-gray-800 transition"
                    >
                      <HiOutlineCamera size={14} />
                      Photo
                    </button>
                  </div>

                  {/* RIGHT GROUP */}
                  <div className="flex gap-2">
                    {/* ONLY EXPIRED */}
                    {client.expired < 0 && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRenewalClick(client)}
                      >
                        <MdLoop size={14} />
                        {/* Renew */}
                      </Button>
                    )}

                    {/* ONLY PENDING */}
                    {isPending && (
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => onClearPending(client)}
                      >
                        <IoMdCheckmarkCircleOutline size={14} />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        : Array.from({ length: 8 }).map((_, i) => <ClientShimmer key={i} />)}
    </div>
  );
}

export default ClientGrid;
