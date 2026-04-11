import Tippy from "@tippyjs/react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getTooltip } from "../../../../Components/datePicker/MultiDatePickerNew";
function ReportMonthCalender({ monthlyStudentAttendanceData }) {
  const highlightDates = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const dayData = monthlyStudentAttendanceData?.find(
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
  const selectedDate = monthlyStudentAttendanceData?.[0]
    ? new Date(monthlyStudentAttendanceData[0].date)
    : new Date(); // fallback to current date if no data

  return (
    <div className="monthlyReportCalender">
      <DatePicker
        selected={selectedDate}
        dayClassName={(date) => highlightDates(date)}
        shouldCloseOnSelect={false}
        shouldCloseOnClickOutside={false}
        inline
        renderDayContents={(day, date) => {
          const tooltip = getTooltip(date, monthlyStudentAttendanceData);
          return (
            <Tippy content={tooltip}>
              <span aria-disabled={tooltip === "Holiday"}>{day}</span>
            </Tippy>
          );
        }}
      />
    </div>
  );
}

export default ReportMonthCalender;
