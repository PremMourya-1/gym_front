import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import formatDate from "../../../Utils/formateDate";
import Table from "../../../Components/Table/Table";

function HolidayTable({ data, onEditClick, onDeleteClick }) {
  const columnsData = [
    {
      title: "Title",
      width: "20px",
      selector: (row) => {
        return row.title;
      },
    },
    {
      title: "Day",
      width: "40px",
      selector: (row) => (
        <span>
          {row.day} {row.day > 1 ? "Days" : "Day"}
        </span>
      ),
    },
    {
      title: "Start Date",
      selector: (row) => formatDate(row.startDate),
    },
    {
      title: "end Date",
      selector: (row) => formatDate(row.endDate),
    },

    {
      title: "Action",
      width: "30px",
      selector: (row) => {
        return (
          <ActionButtons
            data={row}
            onDelete={onDeleteClick}
            onEdit={onEditClick}
          />
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

export default HolidayTable;
