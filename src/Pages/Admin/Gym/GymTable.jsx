import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";

function GymTable({ onEditClick, onDeleteClick, data }) {
  const columns = [
    {
      title: "Gym Name",
      selector: (item) => item.gymName,
    },
    {
      title: "Owner",
      selector: (item) => item.ownerName,
    },
    {
      title: "Email",
      selector: (item) => item.email,
    },
    {
      title: "Phone",
      selector: (item) => item.phone,
    },
    {
      title: "City",
      selector: (item) => item.city,
    },
    {
      title: "Plan Start",
      selector: (item) =>
        item.planStartDate
          ? new Date(item.planStartDate).toLocaleDateString()
          : "-",
    },
    {
      title: "Plan End",
      selector: (item) =>
        item.planEndDate
          ? new Date(item.planEndDate).toLocaleDateString()
          : "-",
    },
    {
      title: "Status",
      selector: (item) => (
        <span
          className={`px-2 py-1 rounded text-xs ${
            item.status
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {item.status ? "Active" : "Inactive"}
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

export default GymTable;
