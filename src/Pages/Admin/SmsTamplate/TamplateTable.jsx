import { Toggle } from "rsuite";
import CheckIcon from "@rsuite/icons/Check";
import CloseIcon from "@rsuite/icons/Close";
import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";

function TamplateTable({ data, onEditClick, onDeleteClick, onChangeStatus }) {
  const columnsData = [
    {
      title: "message Type",
      selector: (row) => row.messageType,
    },
    {
      title: "message",
      selector: (row) => {
        return <p className="line-clamp-1">{row.message} </p>;
      },
    },
    {
      title: "variable",
      selector: (row) => row.variable,
    },
    {
      title: "template Id",
      selector: (row) => row.templateId,
    },

    {
      title: "Active",
      selector: (row) => {
        return (
          <>
            <Toggle
              onChange={(e) => {
                onChangeStatus(e, row.id);
              }}
              checkedChildren={<CheckIcon />}
              unCheckedChildren={<CloseIcon />}
              checked={Boolean(Number(row.status))}
            />
          </>
        );
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

export default TamplateTable;
