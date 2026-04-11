import { Toggle } from "rsuite";
import Table from "../../../../Components/Table/Table";
import CheckIcon from "@rsuite/icons/Check";
import CloseIcon from "@rsuite/icons/Close";
import { MdEdit } from "react-icons/md";

function SmsTable({ data, onEditClick, onStatusChange }) {
  const columnsData = [
    {
      title: "Url",
      width: "20px",
      selector: (row) => {
        return row.url;
      },
    },
    {
      title: "User Id",
      selector: (row) => row.userId,
    },
    {
      title: "institute Name",
      selector: (row) => row.instituteName,
    },
    {
      title: "Password",
      selector: (row) => row.password,
    },
    {
      title: "Sender Id",
      selector: (row) => row.senderId,
    },
    {
      title: "P Id",
      selector: (row) => row.pId,
    },
    {
      title: "Active",
      selector: (row) => {
        return (
          <Toggle
            onChange={(e) => {
              onStatusChange(e);
            }}
            checkedChildren={<CheckIcon />}
            unCheckedChildren={<CloseIcon />}
            checked={Boolean(Number(row.isSms))}
          />
        );
      },
    },
    {
      title: "Action",
      width: "30px",
      selector: (row) => {
        return (
          <button
            onClick={() => {
              onEditClick(row);
            }}
          >
            <MdEdit className="text-lg" />
          </button>
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

export default SmsTable;
