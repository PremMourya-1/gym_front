import Tippy from "@tippyjs/react";
import Table from "../../../../Components/Table/Table";
import { FaRegEye } from "react-icons/fa6";

function ReportTable({ data, onActionClick }) {
  const columns = [
    // {
    //   title: "Sr no",
    //   width: "80px",
    //   selector: (_, i) => {
    //     return i + 1;
    //   },
    // },
    {
      title: "adm No",
      width: "80px",
      selector: (row) => {
        return row.student_master.admissionNo;
      },
    },
    {
      title: "Device Id",
      width: "80px",
      selector: (row) => {
        return row.student_master.deviceId;
      },
    },
    {
      title: "Student name",
      width: "80px",
      selector: (row) => {
        return row.student_master.studentName;
      },
    },
    {
      title: "father's name",
      width: "80px",
      selector: (row) => {
        return row.student_master.fathersName;
      },
    },
    {
      title: "class",
      width: "80px",
      selector: (row) => {
        return `${row.class_master?.name}-${row.stream_master?.name}-${row.section_master?.name}`;
      },
    },

    {
      title: "Action",
      width: "60px",
      selector: (row) => {
        return (
          <>
            <Tippy content="View Attendance">
              <button
                onClick={() => {
                  onActionClick(row);
                }}
                className="flex gap-2 items-center font-semibold p-1.5 hover:bg-gray-300 rounded-md dark:hover:bg-gray-900  text-sm cursor-pointer text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                <FaRegEye className="text-base fill-gray-500 dark:fill-gray-300" />
              </button>
            </Tippy>
          </>
        );
      },
    },
  ];
  return (
    <>
      <div className="card mb-4 p-4 ">
        <Table columns={columns} data={data} />
      </div>
    </>
  );
}

export default ReportTable;
