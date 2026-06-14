import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Switch from "../../../Components/Switch";
import Table from "../../../Components/Table/Table";

function PlanTable({ onChangeStatus, onEditClick, onDeleteClick, data }) {
  const columns = [
    {
      title: "Plan Name",
      selector: (item) => item.name,
    },
    {
      title: "Amount",
      selector: (item) => `₹ ${item.amount}`,
    },
    {
      title: "Duration",
      selector: (item) => `${item.duration} Month`,
    },
    {
      title: "Max Clients",
      selector: (item) => item.maxClients,
    },
    {
      title: "Active",
      selector: (row) => (
        <Switch
          item={row}
          onChangeStatus={onChangeStatus}
          checked={Boolean(row.isActive)}
          type={"isActive"}
        />
      ),
    },

    {
      title: "Action",
      selector: (item) => (
        <ActionButtons
          data={item}
          onEdit={onEditClick}
          onDelete={onDeleteClick}
        />
      ),
    },
  ];

  return (
    <div className="card p-4">
      <Table columns={columns} data={data} />
    </div>
  );
}

export default PlanTable;
