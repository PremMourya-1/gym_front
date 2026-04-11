import Table from "../../../../Components/Table/Table";
import { CiViewTable } from "react-icons/ci";
import Tippy from "@tippyjs/react";
import { SlCalender } from "react-icons/sl";

function AttendanceTable({
  checkedValues,
  handleChange,
  allChecked,
  data,
  onViewClick,
}) {
  // day only
  const dayColumnData = [
    {
      width: "80px",
      title: () => {
        return (
          <>
            <input
              id="all"
              type="checkbox"
              className="form-check-input h-4 w-4 accent-[color:var(--primary-dark)] "
              onChange={handleChange}
              checked={allChecked}
              disabled={!data.studentData?.length}
            />
          </>
        );
      },
      selector: (row) => {
        return (
          <>
            <input
              type="checkbox"
              className="form-check-input h-4 w-4 accent-[color:var(--primary-dark)] "
              id={row.promotionId}
              onChange={handleChange}
              checked={checkedValues[row.promotionId]}
            />
          </>
        );
      },
    },
    {
      title: "Adm No",
      width: "100px",
      selector: (row) => row.admissionNo,
    },
    {
      title: "Device Id",
      width: "100px",
      selector: (row) => row.deviceId,
    },

    {
      title: "Student Name	",
      selector: (row) => row.studentName,
    },
    {
      title: "Father Name	",
      selector: (row) => row.fathersName,
    },

    {
      title: "Attendance",
      width: "120px",
      selector: (row) => {
        return (
          <>
            <span
              className={` ${
                (row.isPresent === 0 && "bg-red-600") ||
                (row.isPresent === 1 && "bg-green-600") ||
                (row.isPresent === 3 && "bg-yellow-600")
              }  h-8 w-8 text-sm text-white font-semibold rounded-full flex items-center justify-center`}
            >
              {row.isPresent === 0 && "A"}
              {row.isPresent === 1 && "P"}
              {row.isPresent === 3 && "H"}
            </span>
          </>
        );
      },
    },
    {
      title: "IN",
      width: "40px",
      selector: (row) => {
        return (
          <>
            <span
              className={`text-green-600 font-semibold rounded-full flex items-center justify-center`}
            >
              {row.in}
            </span>
          </>
        );
      },
    },
    {
      title: "OUT",
      width: "40px",
      selector: (row) => {
        return (
          <>
            <span
              className={`text-red-600 font-semibold rounded-full flex items-center justify-center`}
            >
              {row.out}
            </span>
          </>
        );
      },
    },
  ];
  // month and year
  const columnsData = [
    {
      title: "Adm No",
      width: "100px",
      selector: (row) => row.student?.admissionNo,
    },
    {
      title: "Device Id",
      width: "100px",
      selector: (row) => row.student?.deviceId,
    },

    {
      title: "Student Name	",
      selector: (row) => row.student?.studentName,
    },
    {
      title: "Father Name	",
      selector: (row) => row.student?.fathersName,
    },
    {
      title: "Total Days",
      width: "110px",
      selector: (row) => row.totalDay,
    },

    {
      title: "Holiday",
      width: "80px",
      selector: (row) => (
        <span
          className={` bg-yellow-500  h-8 w-8 text-sm  text-white font-semibold rounded-full flex items-center justify-center`}
        >
          {row.holidays}
        </span>
      ),
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
      width: "80px",
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
      width: "80px",
    },
  ];

  if (data.type !== "day") {
    columnsData.push({
      title: "view",
      width: "100px",

      selector: (row) => {
        return (
          <div className="flex ">
            {data.type === "month" && (
              <Tippy content="Table View ">
                <button
                  onClick={() => {
                    onViewClick(row, "table");
                  }}
                  className="flex gap-2 items-center font-semibold p-1.5 hover:bg-gray-300 rounded-md dark:hover:bg-gray-900  text-sm cursor-pointer text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  <CiViewTable className="text-2xl fill-gray-600 dark:fill-gray-300" />
                </button>
              </Tippy>
            )}
            <Tippy content="Calender View">
              <button
                onClick={() => {
                  onViewClick(row, "calender");
                }}
                className="flex gap-2 items-center font-semibold p-1.5 hover:bg-gray-300 rounded-md dark:hover:bg-gray-900  text-sm cursor-pointer text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                <SlCalender className="text-lg fill-gray-600 dark:fill-gray-300" />
              </button>
            </Tippy>
          </div>
        );
      },
    });
  }
  return (
    <Table
      columns={data?.type === "date" ? dayColumnData : columnsData}
      data={data?.studentData}
    />
  );
}

export default AttendanceTable;
