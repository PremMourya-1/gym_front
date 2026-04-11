import moment from "moment";
import DatePicker from "react-datepicker";
import { getTooltip } from "../../../../Components/datePicker/MultiDatePickerNew";
import Tippy from "@tippyjs/react";

function ReportYearCalender({ yearlyStudentAttendanceData }) {
  const yearData = yearlyStudentAttendanceData.studentData;

  const highlightDates = (date, month) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const dayData = month.data?.find(
      (d) => moment(d.date).format("YYYY-MM-DD") === formattedDate
    );

    if (dayData) {
      return (
        (dayData.isPresent === 0 && "red-day") ||
        (dayData.isPresent === 1 && "green-day") ||
        (dayData.isPresent === 2 && "not-working-day") ||
        (dayData.isPresent === 3 && "sunday") ||
        (dayData.isPresent === 4 && "holiday")
      );
    }
    return "not-working-day";
  };
  function everyMont(index) {
    const selectedDate = yearData?.[index].data[0]
      ? new Date(yearData[index].data[0].date)
      : new Date(); // fallback to current date if no data
    return selectedDate;
  }
  return (
    <div className="monthlyReportCalender">
      <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-8">
        {yearlyStudentAttendanceData.studentData.map((it, i) => {
          return (
            <div key={i + 1}>
              <div className="w-max overflow-hidden">
                <DatePicker
                  selected={everyMont(i)}
                  dayClassName={(date) => highlightDates(date, yearData[i])}
                  shouldCloseOnSelect={false}
                  shouldCloseOnClickOutside={false}
                  inline
                  renderDayContents={(day, date) => {
                    const tooltip = getTooltip(date, yearData[i].data);
                    return (
                      <Tippy content={tooltip}>
                        <span aria-disabled={tooltip === "Holiday"}>{day}</span>
                      </Tippy>
                    );
                  }}
                />
              </div>
              <div className="capitalize flex flex-wrap gap-1.5 mt-2">
                <p className="bg-green-700 text-white flex-1 text-center  rounded-md px-2 py-1.5 text-sm font-semibold ">
                  <span>Present </span>
                  <span>
                    {it.data?.filter((e) => e.isPresent === 1)?.length}
                  </span>
                </p>
                <p className="bg-red-600 text-white flex-1 text-center  rounded-md px-2 py-1.5 text-sm font-semibold ">
                  <span>Absent </span>
                  {it.data?.filter((e) => e.isPresent === 0)?.length}
                </p>
                <p className="bg-yellow-500 text-white flex-1 text-center  rounded-md px-2 py-1.5 text-sm font-semibold ">
                  <span>Holiday </span>
                  {it.data?.filter((e) => e.isPresent === 3)?.length +
                    it.data?.filter((e) => e.isPresent === 4)?.length}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReportYearCalender;
