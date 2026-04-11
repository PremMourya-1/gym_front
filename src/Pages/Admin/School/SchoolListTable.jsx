import { Link } from "react-router-dom";
import ActionButtons from "../../../Components/Common/ActionButtons/ActionButtons";
import Table from "../../../Components/Table/Table";
import { FaRegEye } from "react-icons/fa";
import { Toggle } from "rsuite";
import CheckIcon from "@rsuite/icons/Check";
import CloseIcon from "@rsuite/icons/Close";
import formatDate from "../../../Utils/formateDate";

function SchoolListTable({ data, onEditClick, onDeleteClick, onChangeStatus }) {
  const columns = [
    {
      title: "organization Name",
      width: "100px",
      selector: (item) => {
        return item.schoolName;
      },
    },
    {
      title: "Name",
      width: "100px",
      selector: (item) => {
        return item.name;
      },
    },
    {
      title: "Registration Date",
      width: "100px",
      selector: (item) => {
        return formatDate(item.createdAt);
      },
    },
    {
      title: "Expire On",
      width: "110px",
      selector: (item) => {
        return formatDate(item.expDate);
      },
    },
    {
      title: "organization Contact",
      width: "100px",
      selector: (item) => {
        return item.schoolContact;
      },
    },
    {
      title: "contact",
      width: "100px",
      selector: (item) => {
        return item.contact;
      },
    },
    {
      title: "state",
      width: "100px",
      selector: (item) => {
        return item.state?.split("-")[0];
      },
    },
    {
      title: "district",
      width: "80px",
      selector: (item) => {
        return item.district?.split("-")[0];
      },
    },
    {
      title: "Active",
      width: "60px",
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
      width: "100px",
      selector: (item) => {
        return (
          <div className="flex flex-col">
            <ActionButtons
              data={item}
              onEdit={onEditClick}
              onDelete={onDeleteClick}
            />
            <Link
              to={`/admin/organization/${item.id}`}
              className="flex gap-2 items-center w-max font-semibold p-1.5 hover:bg-gray-300 rounded-md dark:hover:bg-gray-900  text-sm cursor-pointer text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              <FaRegEye className="text-xl fill-gray-700 dark:fill-gray-300" />
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="card p-4">
        <Table columns={columns} data={data} />
      </div>
    </>
  );
}

export default SchoolListTable;
