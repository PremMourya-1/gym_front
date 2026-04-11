import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";

function DeviceTable({ data, onEditClick, onDeleteClick }) {
  const columnsData = [
    {
      title: "Device Name",
      width: "20px",
      selector: (row) => {
        return row.deviceName;
      },
    },
    {
      title: "Device Id",
      width: "20px",
      selector: (row) => {
        return row.deviceId;
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

export default DeviceTable;
