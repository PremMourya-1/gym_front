import { writeFile, utils } from "xlsx";
const downloadXl = (columns, data, fileName = "table.xlsx") => {
  const headers = columns.map((column) => column.name);
  const rows = data.map((row) =>
    columns.map((column) => {
      if (typeof column.selector === "function") {
        return column.selector(row);
      }
      return row[column.selector];
    })
  );
  const sheetData = [headers, ...rows];

  const worksheet = utils.aoa_to_sheet(sheetData);

  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, "Sheet1");

  writeFile(workbook, fileName);
};

export default downloadXl;
