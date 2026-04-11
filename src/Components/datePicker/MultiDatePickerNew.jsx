import Tippy from "@tippyjs/react";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function MultiDatePickerNew({ attendance, setAttendance }) {
  const handleDateClick = (clickedDate) => {
    const clickedDateFormatted = moment(clickedDate)?.format("YYYY-MM-DD");

    const updatedAttendance = attendance?.map((item) => {
      if (moment.utc(item.date).format("YYYY-MM-DD") === clickedDateFormatted) {
        if (item.isPresent === 3 || item.isPresent === 4) {
          return item;
        } else {
          return {
            ...item,
            isPresent: item.isPresent === 1 ? 0 : 1,
          };
        }
      }
      return item;
    });
    setAttendance(updatedAttendance);
  };
  const highlightDates = (date) => {
    const formattedDate = moment(date).format("YYYY-MM-DD");
    const dayData = attendance?.find((d) => {
      return moment.utc(d.date).format("YYYY-MM-DD") === formattedDate;
    });

    if (dayData) {
      const diff =
        new Date(moment(dayData?.date).format("YYYY-MM-DD")) - new Date();
      const afterDate = diff / (1000 * 60 * 60 * 24);

      return (
        (dayData.isPresent === 0 && "red-day") ||
        (dayData.isPresent === 1 && "green-day") ||
        (dayData.isPresent === 2 && afterDate > 0 && "not-working-day") ||
        (dayData.isPresent === 3 && "sunday") ||
        (dayData.isPresent === 4 && "holiday")
      );
    }
    return "not-working-day";
  };
  const selectedDate = attendance?.[0]
    ? new Date(attendance[0].date)
    : new Date();

  return (
    <>
      <div className="monthlyReportCalender">
        <DatePicker
          selected={selectedDate}
          dayClassName={(date) => highlightDates(date)}
          shouldCloseOnSelect={false}
          shouldCloseOnClickOutside={false}
          inline
          onSelect={(date) => handleDateClick(date)}
          renderDayContents={(day, date) => {
            const tooltip = getTooltip(date, attendance);
            return (
              <Tippy content={tooltip}>
                <span aria-disabled={tooltip === "Holiday"}>{day}</span>
              </Tippy>
            );
          }}
        />
      </div>
    </>
  );
}

export const getTooltip = (date, attendance) => {
  const formattedDate = moment(date).format("YYYY-MM-DD");
  const dayData = attendance?.find((d) => {
    return moment.utc(d.date).format("YYYY-MM-DD") === formattedDate;
  });

  if (dayData) {
    if (dayData.isPresent === 0) return "Absent";
    if (dayData.isPresent === 1) return "Present";
    if (dayData.isPresent === 2) return "Mark Attendance";
    if (dayData.isPresent === 3) return "Sunday";
    if (dayData.isPresent === 4) return "Holiday";
  }
  return "";
};

export default MultiDatePickerNew;
