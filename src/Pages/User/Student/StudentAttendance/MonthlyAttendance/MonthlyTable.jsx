import Tippy from "@tippyjs/react";
import Table from "../../../../../Components/Table/Table";
import icons from "../../../../../Utils/icons/icons";

function MonthlyTable({ data, onActionClick }) {
  const columns = [
    {
      title: "Student Name",
      selector: (row) => row.student.studentName,
    },
    {
      title: "Adm No",
      width: "80px",
      selector: (row) => row.student.admissionNo,
    },
    {
      title: "Device Id",
      width: "80px",
      selector: (row) => row.student.deviceId,
    },

    {
      title: "Father's Name",
      selector: (row) => row.student.fathersName,
    },

    {
      title: "Total Days",
      selector: (row) => row.totalDay,
      width: "100px",
    },
    {
      title: "Holiday",
      selector: (row) => row.holidays,
      width: "100px",
    },
    {
      title: "Present",
      selector: (row) => (
        <span
          className={` bg-green-600  h-8 w-8 text-sm  text-white font-semibold rounded-full flex items-center justify-center`}
        >
          {row.totalPresent}
        </span>
      ),
      width: "100px",
    },
    {
      title: "Absent",
      selector: (row) => (
        <span
          className={` bg-red-600  h-8 w-8 text-sm  text-white font-semibold rounded-full flex items-center justify-center`}
        >
          {row.totalAbsent}
        </span>
      ),
      width: "100px",
    },

    {
      title: "Action",
      width: "60px",
      selector: (row) => {
        return (
          <>
            <Tippy content="Apply Attendance">
              <button
                onClick={() => {
                  onActionClick(row);
                }}
              >
                {icons.action("text-xl")}
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

export default MonthlyTable;
