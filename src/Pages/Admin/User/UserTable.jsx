import { Toggle } from "rsuite";
import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";
import CheckIcon from "@rsuite/icons/Check";
import CloseIcon from "@rsuite/icons/Close";

function UserTable({ data, onEditClick, onDeleteClick, onChangeStatus }) {
  const columnsData = [
    {
      title: "Name",
      selector: (row) => {
        return row.fullName;
      },
    },
    {
      title: "mobile No",
      selector: (row) => {
        return row.mobileNo;
      },
    },
    {
      title: "Email",
      selector: (row) => {
        return row.email;
      },
    },
    {
      title: "Role",
      selector: (row) => {
        return row.rolePermission?.role;
      },
    },

    {
      title: "Active",
      selector: (row) => {
        return (
          <Toggle
            onChange={(e) => {
              onChangeStatus(e, row.id);
            }}
            checkedChildren={<CheckIcon />}
            unCheckedChildren={<CloseIcon />}
            checked={Number(row.isActive)}
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

export default UserTable;
