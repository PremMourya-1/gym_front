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
    const { id } = useParams();

    const [data, setData] = useState(null);

    useEffect(() => {
        getRenewals({ id }, setData);
    }, [id, reload]);

    // 🔥 table columns
    const columnsData = [
        {
            title: "Renewal Date",
            selector: (row) =>
                moment(row.renewalDate).format("D MMM YYYY"),
        },
        {
            title: "Plan",
            selector: (row) => toCamelCase(row.plan?.name),
        },
        {
            title: "Price",
            selector: (row) => `₹ ${row.plan?.amount}`,
        },
        {
            title: "Paid",
            selector: (row) => (
                <span className="text-green-700">
                    ₹ {row.paidAmount}
                </span>
            ),
        },
        {
            title: "Pending",
            selector: (row) => (
                <span className="text-red-700">
                    ₹ {row.pendingAmount}
                </span>
            ),
        },
        {
            title: "Expire ?",
            selector: (row) => {
                const today = moment();
                const expiry = moment(row.expiryDate);
                const diff = expiry.diff(today, "days");

                const date = expiry.format(DATE_MONTH_FORMATE);

                return diff < 0 ? (
                    <div className="text-red-600">
                        <div className="font-medium text-sm">{date}</div>
                        <div className="text-xs">
                            {Math.abs(diff)} days ago
                        </div>
                    </div>
                ) : diff === 0 ? (
                    <div className="text-orange-500">
                        <div className="font-medium text-sm">{date}</div>
                        <div className="text-xs">Expiring Today</div>
                    </div>
                ) : (
                    <div className="text-yellow-600">
                        <div className="font-medium text-sm">{date}</div>
                        <div className="text-xs">
                            {diff} days left
                        </div>
                    </div>
                );
            },
        }
    ];

    if (!data) return null;

    return (
        <div className="space-y-4">
            {/* 🔥 Client Info Card */}
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

                    <div>
                        <p className="text-gray-400 text-xs">Name</p>
                        <p className="font-medium dark:text-gray-200">
                            {toCamelCase(data.client?.clientName)}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-400 text-xs">Mobile</p>
                        <p className="font-medium dark:text-gray-200">
                            {data.client?.mobileNo}
                        </p>
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

                    <div className="bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Total Pendings</p>
                        <p className="text-red-600 dark:text-red-400 font-semibold">
                            ₹ {data.summary?.totalPending || 0}
                        </p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Pending Recovered</p>
                        <p className="text-blue-600 dark:text-blue-400 font-semibold">
                            ₹ {data.summary?.totalPendingReceived || 0}
                        </p>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Still Pending</p>
                        <p className="text-red-600 dark:text-red-400 font-semibold">
                            ₹ {(data.summary?.totalPending || 0) -
                                (data.summary?.totalPendingReceived || 0) -
                                (data.summary?.totalDiscountOnPending || 0)}
                        </p>
                    </div>

                    <div className="bg-pink-50 dark:bg-pink-900/20 px-3 py-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Discount On Pendings</p>
                        <p className="text-pink-600 dark:text-pink-400 font-semibold">
                            ₹ {data.summary?.totalDiscountOnPending || 0}
                        </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Total Collected</p>
                        <p className="text-green-600 dark:text-green-400 font-semibold">
                            ₹ {data.summary?.totalPaid || 0}
                        </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 px-3 py-2 rounded">
                        <p className="text-xs text-gray-500 dark:text-gray-300">Discount</p>
                        <p className="text-yellow-600 dark:text-yellow-400 font-semibold">
                            ₹ {data.summary?.totalDiscount || 0}
                        </p>
                    </div>

                </div>

            </Card>

            {/* 🔥 Renewal Table */}
            <Card className=" " isBorder>

                <Table
                    isRounded={true}
                    isHeaderColor
                    columns={columnsData}
                    data={data.renewals}
                />
            </Card>
        </div>
    );
}

export default RenewList;