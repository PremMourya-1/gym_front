import Table from "../../../Components/Table/Table";
import formatDate from "../../../Utils/formateDate";

function UserDetailTable({ data }) {
  const columnsData = [
    {
      title: "Amount",
      selector: (row) => {
        return (
          <span>
            ₹ {row.paymentAmount ? row.paymentAmount?.toLocaleString() : "0"}
          </span>
        );
      },
    },
    {
      title: "Student's",
      selector: (row) => {
        return row.studentCount?.toLocaleString();
      },
    },
    {
      title: "Date",
      selector: (row) => {
        return formatDate(row.startDate);
      },
    },

    {
      title: "Payment Method",
      selector: (row) => {
        return row.paymentMethod;
      },
    },
    {
      title: "Transition Id",
      selector: (row) => {
        return row.transactionId;
      },
    },
  ];
  return (
    <>
      <div className="card rounded-lg p-3">
        <Table columns={columnsData} data={data} />
      </div>
    </>
  );
}

export default UserDetailTable;
