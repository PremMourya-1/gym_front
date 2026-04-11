import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";

function PlanTable({ onEditClick, onDeleteClick, data }) {
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
      title: "Status",
      selector: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            item.isActive
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.isActive ? "Active" : "Inactive"}
        </span>
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
