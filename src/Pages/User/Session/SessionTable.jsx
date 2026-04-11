import moment from "moment/moment";
import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";
import { Toggle } from "rsuite";
import CheckIcon from "@rsuite/icons/Check";
import CloseIcon from "@rsuite/icons/Close";

function SessionTable({ data, onEditClick, onDeleteClick, onChangeStatus }) {
  const columnsData = [
    // {
    //   title: "Sr no",
    //   width: "80px",
    //   selector: (_, i) => {
    //     return i + 1;
    //   },
    // },
    {
      title: "Name",
      selector: (row) => row.sessionName,
    },
    {
      title: "Start Date",
      selector: (row) => moment(row.startDate).format("DD-MM-YYYY"),
    },
    {
      title: "end Date",
      selector: (row) => moment(row.endDate).format("DD-MM-YYYY"),
    },
    {
      title: "Active",
      selector: (row) => {
        return (
          <Toggle
            onChange={(e) => {
              onChangeStatus(e, row.id);
            }}
            disabled={data.length === 1}
            checkedChildren={<CheckIcon />}
            unCheckedChildren={<CloseIcon />}
            checked={Boolean(Number(row.isActive))}
          />
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

export default SessionTable;
