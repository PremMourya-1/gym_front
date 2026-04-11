export default function formatDate(dateString) {
  const date = new Date(dateString);

  const day = date.getUTCDate();
  const year = date.getUTCFullYear();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[date.getUTCMonth()];
  return dateString ? `${day} ${month} ${year}` : null;
}

function dateDifference(currentDate, expiryDate) {
  const timeDifference = expiryDate.getTime() - new Date().getTime();
  const daysRemaining = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return daysRemaining;
}

export const DATE_MONTH_FORMATE = "DD MMM YYYY";
export { dateDifference };
