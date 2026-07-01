import * as XLSX from "xlsx";
import dayjs from "dayjs";

const normalizeHeader = (value) => String(value || "").trim();

const normalizeMobile = (value) => String(value || "").trim();

export const normalizeAmount = (value) => {
  if (value === null || value === undefined) return 0;

  const stringValue = String(value).replace(/,/g, "");
  const match = stringValue.match(/-?\d+(?:\.\d+)?/);

  return match ? Number(match[0]) : 0;
};

export const normalizeDateToDDMMYYYY = (value) => {
  if (!value) return "";

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return dayjs(value).format("DD-MM-YYYY");
  }

  if (typeof value === "number") {
    const parsedDate = XLSX.SSF.parse_date_code(value);
    if (!parsedDate) return "";

    return dayjs(
      new Date(
        parsedDate.y,
        parsedDate.m - 1,
        parsedDate.d,
        parsedDate.H || 0,
        parsedDate.M || 0,
        parsedDate.S || 0,
      ),
    ).format("DD-MM-YYYY");
  }

  const trimmedValue = String(value).trim();

  if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(trimmedValue)) {
    const [day, month, year] = trimmedValue.split(/[-/]/).map(Number);
    return dayjs(new Date(year, month - 1, day)).format("DD-MM-YYYY");
  }

  const monthNameMatch = trimmedValue.match(
    /^(\d{1,2})\s+([A-Za-z]{3,9})\s+(\d{4})$/,
  );

  if (monthNameMatch) {
    const [, dayPart, monthName, yearPart] = monthNameMatch;
    const monthIndex = {
      jan: 0,
      january: 0,
      feb: 1,
      february: 1,
      mar: 2,
      march: 2,
      apr: 3,
      april: 3,
      may: 4,
      jun: 5,
      june: 5,
      jul: 6,
      july: 6,
      aug: 7,
      august: 7,
      sep: 8,
      sept: 8,
      september: 8,
      oct: 9,
      october: 9,
      nov: 10,
      november: 10,
      dec: 11,
      december: 11,
    }[monthName.toLowerCase()];

    if (monthIndex !== undefined) {
      return dayjs(
        new Date(Number(yearPart), monthIndex, Number(dayPart)),
      ).format("DD-MM-YYYY");
    }
  }

  const nativeDate = new Date(trimmedValue);
  if (!Number.isNaN(nativeDate.getTime())) {
    return dayjs(nativeDate).format("DD-MM-YYYY");
  }

  return trimmedValue;
};

export const parseExcelFile = async (file) => {
  if (!file) {
    return { headers: [], rows: [] };
  }

  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, {
    type: "array",
    cellDates: true,
  });

  const firstSheetName = workbook.SheetNames?.[0];
  if (!firstSheetName) {
    return { headers: [], rows: [] };
  }

  const worksheet = workbook.Sheets[firstSheetName];
  const matrixRows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: "",
    raw: false,
  });

  const firstHeaderRow = Array.isArray(matrixRows?.[0]) ? matrixRows[0] : [];
  const headers = firstHeaderRow.map(normalizeHeader).filter(Boolean);

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
    raw: false,
  });

  return {
    headers,
    rows,
  };
};

export const detectDuplicateMobiles = (
  rows,
  mobileHeader,
  clientNameHeader = null,
) => {
  if (!mobileHeader) {
    return {
      duplicates: [],
      duplicateRowIndexes: new Set(),
      emptyMobileRows: 0,
    };
  }

  const duplicateMap = new Map();
  const duplicateRowIndexes = new Set();
  let emptyMobileRows = 0;

  rows.forEach((row, index) => {
    const mobile = normalizeMobile(row?.[mobileHeader]);
    if (!mobile) {
      emptyMobileRows += 1;
      return;
    }

    const existing = duplicateMap.get(mobile) || [];
    existing.push(index);
    duplicateMap.set(mobile, existing);
  });

  const duplicates = [];

  duplicateMap.forEach((indexes, mobile) => {
    if (indexes.length > 1) {
      const firstIndex = indexes[0];
      const firstRowName = clientNameHeader
        ? String(rows[firstIndex]?.[clientNameHeader] || "").trim()
        : "";
      const firstRowNumber = firstIndex + 2;

      // Only mark 2nd and subsequent rows as duplicates (first row is valid)
      indexes.slice(1).forEach((index) => {
        duplicateRowIndexes.add(index);

        let message = "Duplicate mobile number";
        if (firstRowName) {
          message = `Duplicate with Row ${firstRowNumber} (${firstRowName})`;
        } else if (firstRowNumber !== index + 2) {
          message = `Duplicate with Row ${firstRowNumber}`;
        }

        duplicates.push({
          rowNumber: index + 2,
          mobile,
          message,
        });
      });
    }
  });

  return {
    duplicates,
    duplicateRowIndexes,
    emptyMobileRows,
  };
};
