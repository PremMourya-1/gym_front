import Table from "../../../Components/Table/Table";
import formatDate from "../../../Utils/formateDate";
import toCamelCase from "../../../Utils/modifyString";

function SubscriptionHistoryTable({ data }) {
  const columnsData = [
    {
      title: "Plan",
      selector: (row) => toCamelCase(row.plan?.name || "-"),
    },

    {
      title: "Duration",
      width: "110px",
      selector: (row) => `${row.plan?.duration || 0} Month`,
    },

    {
      title: "Renewal Date",
      selector: (row) => formatDate(row.renewalDate),
    },
    {
      title: "Amount",
      width: "110px",
      selector: (row) => (
        <span className="font-semibold">₹{row.plan?.amount || 0}</span>
      ),
    },

    {
      title: "Expiry Date",
      selector: (row) => formatDate(row.expiryDate),
    },

    {
      title: "Payment Status",
      width: "140px",
      selector: (row) => (
        <span
          className={`px-2 py-1 rounded-md text-xs font-semibold ${
            row.paymentStatus === "paid"
              ? "bg-green-500/10 text-green-500"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {toCamelCase(row.paymentStatus || "-")}
        </span>
      ),
    },

    {
      title: "Provider",
      width: "120px",
      selector: (row) => toCamelCase(row.paymentProvider || "-"),
    },

    {
      title: "Payment Id",
      selector: (row) => row.paymentId || "-",
    },

    {
      title: "Created At",
      selector: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <div className="card rounded-lg p-3">
      <Table columns={columnsData} data={data || []} />
    </div>
  );
}

export default SubscriptionHistoryTable;
