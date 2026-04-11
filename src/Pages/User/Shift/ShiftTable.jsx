import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";

function ShiftTable({ data, onEditClick, onDeleteClick }) {
  const columnsData = [
    // {
    //   title: "Sr no",
    //   width: "80px",
    //   selector: (_, i) => {
    //     return i + 1;
    //   },
    // },
    {
      title: "Name",
      width: "20px",
      selector: (row) => {
        return row.name;
      },
    },
    {
      title: "Start Time",
      selector: (row) => {
        return row.startTime;
      },
    },
    {
      title: "end Time ",
      selector: (row) => {
        return row.endTime;
      },
    },
    {
      title: "Absent Message time ",
      selector: (row) => {
        return <span>{row.absentMessageTime} Min</span>;
      },
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

export default ShiftTable;
