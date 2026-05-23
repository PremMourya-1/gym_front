import moment from "moment";

const DEFAULT_VALUE = "-";

const safeValue = (value) => {
  if (value === null || value === undefined || value === "")
    return DEFAULT_VALUE;
  return value;
};

const formatDate = (dateValue) => {
  if (!dateValue) return DEFAULT_VALUE;
  return moment(dateValue).isValid()
    ? moment(dateValue).format("DD MMM YYYY")
    : DEFAULT_VALUE;
};

export const clientExcelFields = [
  { label: "Client Name", key: "clientName" },
  { label: "Phone Number", key: "mobileNo" },
  { label: "Email", key: "email" },
  { label: "Plan Name", key: "plan.name" },
  {
    label: "Amount",
    key: "plan.amount",
    formatter: (value) => (value ? `Rs ${value}` : DEFAULT_VALUE),
  },
  {
    label: "Joining Date",
    key: "joiningDate",
    formatter: (value) => formatDate(value),
  },
  {
    label: "Expiry Date",
    key: "expiryDate",
    formatter: (value) => formatDate(value),
  },
  {
    label: "Status",
    key: "active",
    formatter: (value) => (value ? "Active" : "Inactive"),
  },
  { label: "Gender", key: "gender" },
  { label: "Age", key: "age" },
  { label: "Address", key: "address" },
];

const getNestedValue = (obj, keyPath) => {
  return keyPath
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      obj,
    );
};

export const getClientExcelColumns = (fields = clientExcelFields) => {
  return fields.map((field) => ({
    name: field.label,
    selector: (row) => {
      const rawValue = getNestedValue(row, field.key);
      const formattedValue = field.formatter
        ? field.formatter(rawValue, row)
        : rawValue;
      return safeValue(formattedValue);
    },
  }));
};
