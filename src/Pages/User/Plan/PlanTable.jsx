import Table from "../../../Components/Table/Table";
import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import toCamelCase from "../../../Utils/modifyString";
import toast from "react-hot-toast";

function PlanTable({ data, onEditClick, onDeleteClick }) {
  const handleCopyId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("Id copied");
    } catch (error) {
      toast.error("Failed to copy");
    }
  };

  const columnsData = [
    {
      title: "Id",
      selector: (row) => (
        <button
          type="button"
          onClick={() => handleCopyId(row.id)}
          className="text-left hover:underline underline-offset-2"
          title={row.id}
        >
          {String(row.id || "").slice(0, 5)}...
        </button>
      ),
    },
    {
      title: "Plan Name",
      selector: (row) => toCamelCase(row.name),
    },
    {
      title: "Price",
      selector: (row) => `₹ ${row.price}`,
    },
    {
      title: "Duration",
      selector: (row) => `${row.duration} Month`,
    },
    {
      title: "Action",
      width: "100px",
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
    <div className="card rounded-lg p-3">
      <Table columns={columnsData} data={data} />
    </div>
  );
}

export default PlanTable;
