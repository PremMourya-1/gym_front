export default function toCamelCase(str) {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function camelToLabel(camelCaseString) {
  if (!camelCaseString) return "";

  // Add space before uppercase letters and capitalize first letter
  const result = camelCaseString
    .replace(/([A-Z])/g, " $1") // Insert space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

  return result;
}
