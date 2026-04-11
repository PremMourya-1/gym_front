import moment from "moment";
import { useContext, useEffect, useRef } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { FaBan } from "react-icons/fa"; // Import any icon you prefer
import { ThemeContext } from "../../Context/ThemeContext";

function CustomMultiDatePicker({
  monthlyStudentAttendanceData,
  setMonthlyStudentAttendanceData,
}) {
  const datePickerRef = useRef();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    datePickerRef.current?.openCalendar();
  }, []);

  // prerfcetttttttttttttttttttttttttttttttttttttttttttttttttttttttttt
  const handleDateClick = (clickedDate) => {
    const clickedDateFormatted = clickedDate?.format("YYYY-MM-DD");

    const updatedAttendance = monthlyStudentAttendanceData?.map((item) => {
      if (moment(item.date).format("YYYY-MM-DD") === clickedDateFormatted) {
        return {
          ...item,
          isPresent: item.isPresent === 1 ? 0 : 1,
        };
      }
      return item;
    });

    setMonthlyStudentAttendanceData(updatedAttendance);
  };

  const mapDays = ({ date }) => {
    const attendanceForDay = monthlyStudentAttendanceData?.find(
      (day) =>
        moment(day.date).format("YYYY-MM-DD") === date.format("YYYY-MM-DD")
    );

    // Disable Sundays
    if (date.weekDay.index === 0) {
      return {
        disabled: true,
        style: {
          color: theme.isDark ? "#7d7d7d" : "#ccc",
          backgroundColor: theme.isDark ? "#363a45" : "#f0f0f0",
        },
      };
    }

    // Allow toggling for presence values 1 and 0
    if (
      attendanceForDay &&
      (attendanceForDay.isPresent === 1 || attendanceForDay.isPresent === 0)
    ) {
      return {
        style: {
          backgroundColor: attendanceForDay.isPresent === 1 ? "green" : "red",
          color: "white",
        },
        title: attendanceForDay.isPresent === 1 ? "Present" : "Absent",
        onClick: () => handleDateClick(date), // Call the new click handler
      };
    }

    // If isPresent is 2, it's a holiday
    if (attendanceForDay && attendanceForDay.isPresent === 2) {
      return {
        disabled: true,
        content: <FaBan style={{ color: "#ccc", fontSize: "16px" }} />,
        style: {
          color: theme.isDark ? "#7d7d7d" : "#ccc",
          backgroundColor: theme.isDark ? "#363a45" : "#f0f0f0",
        },
        title: "Holiday",
      };
    }

    return {};
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!datePickerRef.current?.isOpen) {
        datePickerRef.current?.openCalendar();
      }
    }, 0);

    return () => clearInterval(interval);
  }, []);
  const initialDate =
    monthlyStudentAttendanceData.length > 0
      ? moment(monthlyStudentAttendanceData[0].date).toDate()
      : new Date(); // Fallback to current date
  return (
    <>
      {monthlyStudentAttendanceData ? (
        <div id="customDatePicker" className="month">
          <DatePicker
            value={initialDate}
            ref={datePickerRef}
            onChange={handleDateClick}
            multiple
            mapDays={mapDays}
            disable={new DateObject()}
            hideOnBlur={false}
          />
        </div>
      ) : (
        ""
      )}
    </>
  );
}

export default CustomMultiDatePicker;
