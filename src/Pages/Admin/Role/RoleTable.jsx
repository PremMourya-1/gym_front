import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";

function RoleTable({ data, onEditClick, onDeleteClick }) {
  const columnsData = [
    {
      title: "Role",
      width: "10%",
      selector: (row) => {
        return row.role;
      },
    },
    {
      title: "Permissions",
      width: "80%",
      selector: (row) => {
        return row.permission?.map((permission, index) => (
          <span key={index}>{permission} </span>
        ));
      },
    },

    {
      title: "Action",
      width: "30px",
      selector: (row) => {
        return (
          row.role !== "admin" && (
            <ActionButtons
              data={row}
              onDelete={onDeleteClick}
              onEdit={onEditClick}
            />
          )
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

export default RoleTable;
