import Tippy from "@tippyjs/react";
import Table from "../../../../../Components/Table/Table";
import icons from "../../../../../Utils/icons/icons";

function DailyAttendanceTable({ data, onActionClick }) {
  const classColumns = [
    // {
    //   title: "Sr no",
    //   width: "80px",
    //   selector: (_, i) => {
    //     return i + 1;
    //   },
    // },
    {
      title: "Class",
      selector: (row) => {
        return row.className?.name;
      },
      width: "100px",
    },

    {
      title: "Stream",
      selector: (row) => row.streamName?.name,
      width: "100px",
    },

    {
      title: "Section",
      selector: (row) => row.sectionName?.name,
      width: "100px",
    },
    {
      title: "Total Student",
      selector: (row) => row.totalStudents,
      width: "100px",
    },

    {
      title: "Present",
      selector: (row) => (
        <span
          className={` bg-green-600  h-8 w-8 text-sm  text-white font-semibold rounded-full flex items-center justify-center`}
        >
          {row.present}
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
          {row.absent}
        </span>
      ),
      width: "100px",
    },
    {
      title: "Action",
      width: "60px",
      selector: (row) => (
        <>
          <Tippy content="Apply Attendance">
            <button
              className="text-lg"
              onClick={() => {
                onActionClick(row);
              }}
            >
              {icons.action("text-lg")}
            </button>
          </Tippy>
        </>
      ),
    },
  ];

  return (
    <div className="card p-4">
      <Table columns={classColumns} data={data} />
    </div>
  );
}

export default DailyAttendanceTable;
