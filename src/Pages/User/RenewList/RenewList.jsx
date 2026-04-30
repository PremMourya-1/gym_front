import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import moment from "moment";
import { ThemeContext } from "../../../Context/ThemeContext";
import { getRenewals } from "./renewService";
import Table from "../../../Components/Table/Table";
import toCamelCase from "../../../Utils/modifyString";
import { DATE_MONTH_FORMATE } from "../../../Utils/formateDate";
import Card from "../../../Components/Card/Card";
import { FaArrowLeft } from "react-icons/fa";

function RenewList() {
  const { reload } = useContext(ThemeContext);
  const [previewImg, setPreviewImg] = useState(null);

  const { id } = useParams();

  const [data, setData] = useState(null);
  console.log(data);

  useEffect(() => {
    setData();
    getRenewals({ id }, setData);
  }, [id, reload]);

  // 🔥 table columns
  const columnsData = [
    {
      width: "120px",
      title: "Renewal Date",
      selector: (row) => moment(row.renewalDate).format("D MMM YYYY"),
    },
    {
      width: "110px",
      title: "Plan",
      selector: (row) => toCamelCase(row.plan?.name),
    },
    {
      width: "100px",
      title: "Price",
      selector: (row) => `₹ ${row.plan?.amount}`,
    },
    {
      title: "Client Paid",
      width: "110px",
      selector: (row) => (
        <span className="text-green-700">₹ {row.paidAmount}</span>
      ),
    },
    {
      title: "Discount",
      width: "110px",
      selector: (row) => (
        <span className="text-red-700">₹ {row.discountAmount}</span>
      ),
    },
    {
      width: "100px",
      title: "Pending",
      selector: (row) => (
        <span className="text-red-700">₹ {row.pendingAmount}</span>
      ),
    },
    {
      width: "120px",
      title: "Expire ?",
      selector: (row) => {
        const today = moment();
        const expiry = moment(row.expiryDate);
        const diff = expiry.diff(today, "days");

        const date = expiry.format(DATE_MONTH_FORMATE);

        return diff < 0 ? (
          <div className="text-red-600">
            <div className="font-medium text-sm">{date}</div>
            <div className="text-xs">{Math.abs(diff)} days ago</div>
          </div>
        ) : diff === 0 ? (
          <div className="text-orange-500">
            <div className="font-medium text-sm">{date}</div>
            <div className="text-xs">Expiring Today</div>
          </div>
        ) : (
          <div className="text-yellow-600">
            <div className="font-medium text-sm">{date}</div>
            <div className="text-xs">{diff} days left</div>
          </div>
        );
      },
    },
  ];

  // if (!data) return null;

  return (
    <>
      <div className="space-y-4">
        {!data?.client ? (
          <Card>
            <div className="space-y-4">
              {/* Header */}
              <Shimmer className="h-6 w-40" />

              <div className="grid grid-cols-4 md:grid-cols-2 gap-3 text-sm mb-4">
                {/* Client Info */}
                <div className="flex  gap-3 lg:col-span-full">
                  <Shimmer className="w-20 h-20 rounded-xl shrink-0" />
                  <div className="space-y-2">
                    <Shimmer className="h-4 w-32" />
                    <Shimmer className="h-3 w-24" />
                  </div>
                </div>

                {/* Grid Info */}
                <div>
                  <Shimmer className="h-3 w-20 mb-1" />
                  <Shimmer className="h-4 w-28" />
                </div>
                <div>
                  <Shimmer className="h-3 w-20 mb-1" />
                  <Shimmer className="h-4 w-28" />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t dark:border-gray-700 my-3"></div>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 md:grid-cols-2 gap-3">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className=" bg-[#e8e8e8] dark:bg-[#141414] px-3 py-2 rounded"
                  >
                    <Shimmer className="h-3 w-20 mb-2" />
                    <Shimmer className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            {/* 🔹 Header */}
            <div className="mb-3">
              <h2 className="flex gap-2 items-center font-semibold">
                <button onClick={() => history.back()}>
                  <FaArrowLeft />
                </button>
                Client Overview
              </h2>
            </div>

            {/* 🔹 Client Info (TOP) */}
            <div className="grid grid-cols-4 md:grid-cols-2 gap-3 text-sm mb-4">
              <div className="flex  gap-3 lg:col-span-full">
                {/* 🖼️ Client Photo */}
                <img
                  src={`${data.client?.photo}`}
                  alt="client"
                  className="w-20 h-20 md:w-20 md:h-20 rounded-xl object-cover border border-color cursor-pointer"
                  onClick={() => setPreviewImg(`${data.client?.photo}`)}
                />

                {/* 👤 Name + Mobile */}
                <div>
                  <p className="font-semibold text-base dark:text-gray-200">
                    {toCamelCase(data.client?.clientName)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {data.client?.mobileNo}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Joining</p>
                <p className="font-medium dark:text-gray-200">
                  {moment(data.client?.joiningDate).format("D MMM YYYY")}
                </p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Client ID</p>
                <p className="font-medium text-xs truncate dark:text-gray-200">
                  {data.client?.clientId}
                </p>
              </div>
            </div>

            {/* 🔥 Divider */}
            <div className="border-t dark:border-gray-700 my-3"></div>

            {/* 💰 Summary (BOTTOM - separate cards feel) */}
            <div className="grid grid-cols-3 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Total Collected
                </p>
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  ₹ {data.summary?.totalCollectedAmount || 0}
                </p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Discount
                </p>
                <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                  ₹ {data.summary?.totalDiscount || 0}
                </p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Total Pendings
                </p>
                <p className="text-red-600 dark:text-red-400 font-semibold">
                  ₹ {data.summary?.totalPending || 0}
                </p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Pending Recovered
                </p>
                <p className="text-blue-600 dark:text-blue-400 font-semibold">
                  ₹ {data.summary?.totalPendingReceived || 0}
                </p>
              </div>

              <div className="bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Still Pending
                </p>
                <p className="text-red-600 dark:text-red-400 font-semibold">
                  ₹{" "}
                  {(data.summary?.totalPending || 0) -
                    (data.summary?.totalPendingReceived || 0) -
                    (data.summary?.totalDiscountOnPending || 0)}
                </p>
              </div>

              <div className="bg-pink-50 dark:bg-pink-900/20 px-3 py-2 rounded">
                <p className="text-xs text-gray-500 dark:text-gray-300">
                  Discount On Pendings
                </p>
                <p className="text-pink-600 dark:text-pink-400 font-semibold">
                  ₹ {data.summary?.totalDiscountOnPending || 0}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* 🔥 Renewal Table */}
        <Card className=" " isBorder>
          <Table
            isRounded={true}
            isHeaderColor
            columns={columnsData}
            data={data?.renewals}
          />
        </Card>
      </div>
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
          </div>
        </div>
      )}
    </>
  );
}

const Shimmer = ({ className }) => {
  return (
    <div
      className={`animate-pulse bg-[var(--background-light)] rounded ${className}`}
    />
  );
};
export default RenewList;
