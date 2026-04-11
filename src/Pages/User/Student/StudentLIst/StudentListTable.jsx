import Table from "../../../../Components/Table/Table";

import moment from "moment";
import ActionButtons from "../../../../Components/Common/ActionButtons/ActionButtons";
import CheckIcon from "@rsuite/icons/Check";
import CloseIcon from "@rsuite/icons/Close";
import Image from "../../../../Components/Common/Image/Image";
import { Toggle } from "rsuite";

function StudentListTable({
  isEditing = true,
  data,
  onDeleteClick,
  onEditClick,
  onChangeStatus,
}) {
  const columns = [
    {
      title: "Photo",
      width: "60px",
      selector: (row) => {
        return (
          <div className="h-9 w-9 overflow-hidden rounded-full">
            <Image url={row.student_master.photo} />
          </div>
        );
      },
    },
    {
      title: "Adm No.",
      selector: (row) => row.admissionNo,
      width: "100px",
    },
    {
      title: "Device Id",
      selector: (row) => row.deviceId,
      width: "100px",
    },

    {
      title: "Adm Date",
      width: "140px",
      selector: (row) => moment(row.admissionDate).format("DD-MM-YYYY"),
    },

    {
      title: "Student Name",
      width: "140px",
      selector: (row) => row.student_master?.studentName,
    },

    {
      title: "Father's Name",
      selector: (row) => row.student_master?.fathersName,
    },
    {
      title: "Class",
      width: "100px",
      selector: (row) =>
        `${row.class_master?.name} - ${row.stream_master?.name} - ${row.section_master?.name}`,
    },

    {
      title: "Mobile No.",
      width: "80px",
      selector: (row) => row.student_master?.contact,
    },
    {
      title: "Active",
      width: "80px",
      selector: (row) => {
        return (
          <Toggle
            onChange={(e) => {
              onChangeStatus(e, row.id);
            }}
            checkedChildren={<CheckIcon />}
            unCheckedChildren={<CloseIcon />}
            checked={Boolean(Number(row.status))}
          />
        );
      },
    },

    {
      title: "Action",
      width: "40px",
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
  const columns2 = [
    // {
    //   title: "Sr no",
    //   width: "80px",
    //   selector: (_, i) => {
    //     return i + 1;
    //   },
    // },
    {
      title: "Photo",
      width: "60px",
      selector: (row) => {
        return (
          <div className="h-9 w-9 overflow-hidden rounded-full">
            <Image url={row.student_master.photo} />
          </div>
        );
      },
    },
    {
      title: "Adm No.",
      selector: (row) => row.admissionNo,
      width: "100px",
    },
    {
      title: "Device Id",
      selector: (row) => row.deviceId,
      width: "100px",
    },

    {
      title: "Adm Date",
      width: "140px",
      selector: (row) => moment(row.admissionDate).format("DD-MM-YYYY"),
    },

    {
      title: "Student Name",
      selector: (row) => row.student_master?.studentName,
    },

    {
      title: "Father's Name",
      selector: (row) => row.student_master?.fathersName,
    },
    {
      title: "Class",
      selector: (row) =>
        `${row.class_master?.name} - ${row.stream_master?.name} - ${row.section_master?.name}`,
    },

    {
      title: "Mobile No.",
      selector: (row) => row.student_master?.contact,
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
            checked={Boolean(Number(row.status))}
          />
        );
      },
    },
  ];

  return <Table columns={isEditing ? columns : columns2} data={data} />;
}

export default StudentListTable;
