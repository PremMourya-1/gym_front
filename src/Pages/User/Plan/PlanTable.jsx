import Table from "../../../Components/Table/Table";
import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import toCamelCase from "../../../Utils/modifyString";

function PlanTable({ data, onEditClick, onDeleteClick }) {
  const columnsData = [
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
