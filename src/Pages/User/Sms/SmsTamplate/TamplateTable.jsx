import { Toggle } from "rsuite";
import CheckIcon from "@rsuite/icons/Check";
import CloseIcon from "@rsuite/icons/Close";
import Table from "../../../../Components/Table/Table";

function TamplateTable({ data }) {
  const columnsData = [
    // {
    //   title: "Sr no",
    //   width: "80px",
    //   selector: (_, i) => {
    //     return i + 1;
    //   },
    // },
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
          <Toggle
            disabled
            checkedChildren={<CheckIcon />}
            unCheckedChildren={<CloseIcon />}
            checked={Boolean(Number(row.status))}
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
