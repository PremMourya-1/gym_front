import Table from "../../../Components/Table/Table";

import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";

function MasterTable({ data, onEditClick, onDeleteClick }) {
  const columnsData = [
    {
      title: "Name",
      selector: (row) => row.name,
      width: "500px",
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
    <>
      <div className="card rounded-lg p-3">
        <Table columns={columnsData} data={data} />
      </div>
    </>
  );
}

export default MasterTable;
