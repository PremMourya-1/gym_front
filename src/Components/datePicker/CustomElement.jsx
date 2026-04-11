export default function CustomDayRenderer({ day, disableDay, selectedDates }) {
  const isDisabled = disableDay(day);
  const foundDate = selectedDates.find(
    (item) => item.date.toDateString() === day.toDate().toDateString()
  );

  // Define styles based on presence status
  const dayStyle = {
    backgroundColor: foundDate
      ? foundDate.isPresent === 1
        ? "green"
        : "red"
      : "transparent",
    color: "white",
    pointerEvents: isDisabled ? "none" : "auto",
    opacity: isDisabled ? 0.5 : 1,
  };

  return <div style={dayStyle}>{day.day}</div>;
}
