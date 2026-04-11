import Table from "../../../Components/Table/Table";
import formatDate from "../../../Utils/formateDate";

function LogTable({ data }) {
  const columnsData = [
    {
      title: "Date",
      selector: (row) => formatDate(row.date),
    },
    {
      title: "Attendance",
      selector: (row) => {
        return (
          <span
            className={` ${
              (row.isPresent === 0 && "bg-red-600") ||
              (row.isPresent === 1 && "bg-green-600") ||
              (row.isPresent === 3 && "bg-yellow-600")
            }  h-8 w-8  text-sm text-white font-semibold rounded-full flex items-center justify-center`}
          >
            {row.isPresent === 0 && "A"}
            {row.isPresent === 1 && "P"}
            {row.isPresent === 3 && "H"}
          </span>
        );
      },
    },
    {
      title: "IN / OUT",
      selector: (row) => {
        return (
          <span
            className={` ${
              (row.direction === "OUT" && "bg-red-600") ||
              (row.direction === "IN" && "bg-green-600")
            }    text-sm text-white font-semibold rounded-full w-max px-4 py-1 flex items-center justify-center`}
          >
            {row.direction}
          </span>
        );
      },
    },
  ];

  return (
    <div className="card rounded-lg p-3">
      <Table columns={columnsData} data={data} />
    </div>
  );
}

export default LogTable;
