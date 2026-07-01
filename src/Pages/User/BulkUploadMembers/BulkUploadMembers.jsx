import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import Card from "../../../Components/Card/Card";
import Button from "../../../Components/Button/Button";
import {
  detectDuplicateMobiles,
  normalizeAmount,
  parseExcelFile,
} from "./bulkImportUtils";
import dayjs from "dayjs";
import { usePlanOptions } from "./usePlanOptions";
import {
  FaArrowRight,
  FaCheckCircle,
  FaCloudUploadAlt,
  FaExclamationTriangle,
  FaFileExcel,
  FaLink,
  FaSearch,
  FaSyncAlt,
  FaUsers,
} from "react-icons/fa";
import { FaTableColumns } from "react-icons/fa6";
import { bulkImportMembers } from "./bulkUploadService";
import { makeToast } from "../../../Components/Common/Toast/Toast";

const PLAN_MAPPING_METHODS = [
  {
    value: "planId",
    title: "Use Plan ID Column",
    description: "Map each row with an exact planId from excel.",
    icon: FaLink,
  },
  {
    value: "planName",
    title: "Use Plan Name Column",
    description: "Map plans using readable plan names.",
    icon: FaTableColumns,
  },
  {
    value: "amount",
    title: "Detect Plan Using Amount",
    description: "Auto-detect plan based on paid amount value.",
    icon: FaSearch,
  },
  {
    value: "samePlan",
    title: "Assign Same Plan To Everyone",
    description: "Apply one selected plan to all imported members.",
    icon: FaUsers,
  },
];

const mappingFieldDefinitions = [
  { key: "clientName", label: "Client Name", required: true },
  { key: "mobileNo", label: "Mobile No.", required: true },
  { key: "paidAmount", label: "Paid Amount", required: true },
  { key: "joiningDate", label: "Joining Date", required: true },
  { key: "gender", label: "Gender", required: false },
  { key: "discountAmount", label: "Discount Amount", required: false },
  { key: "pendingAmount", label: "Pending Amount", required: false },
  { key: "planId", label: "Plan ID", required: false },
  { key: "planName", label: "Plan Name", required: false },
];

const BASE_REQUIRED_FIELDS = [
  "clientName",
  "mobileNo",
  "paidAmount",
  "joiningDate",
];

const SAMPLE_FILE_HEADERS = [
  "Client Name",
  "Mobile No.",
  "Paid Amount",
  "Joining Date",
  "Gender",
  "Discount Amount",
  "Pending Amount",
  "Plan ID",
  "Plan Name",
];

const FEMALE_NAME_SUFFIXES = [
  "a",
  "i",
  "ika",
  "ita",
  "shi",
  "ya",
  "shree",
  "laxmi",
  "preet",
];

const normalizeGenderFromExcel = (genderValue) => {
  const normalized = String(genderValue || "")
    .trim()
    .toLowerCase();

  if (["f", "female"].includes(normalized)) return "female";
  if (["m", "male"].includes(normalized)) return "male";

  return "";
};

const predictGenderFromName = (fullName) => {
  const firstName = String(fullName || "")
    .trim()
    .split(/\s+/)[0]
    ?.toLowerCase();

  if (!firstName) return "male";

  const isFemale = FEMALE_NAME_SUFFIXES.some((suffix) =>
    firstName.endsWith(suffix),
  );

  return isFemale ? "female" : "male";
};

const buildPlanLabel = (plan) =>
  plan
    ? `${plan.name || plan.label} (₹${Number(plan.price || plan.amount || 0).toLocaleString("en-IN")})`
    : "";

const resolvePlanFromAmount = (amountValue, planOptions) => {
  const amount = Number(amountValue || 0);
  if (!amount || !Array.isArray(planOptions)) return null;

  const plansWithAmount = planOptions
    .map((plan) => ({
      ...plan,
      resolvedAmount: Number(plan.price || plan.amount || 0),
    }))
    .filter((plan) => plan.resolvedAmount > 0)
    .sort((a, b) => a.resolvedAmount - b.resolvedAmount);

  if (!plansWithAmount.length) return null;

  // Check if there's an exact match
  const exactMatch = plansWithAmount.find((p) => p.resolvedAmount === amount);
  if (exactMatch) return exactMatch;

  // If amount is higher than all plans, pick the highest plan
  if (amount > plansWithAmount[plansWithAmount.length - 1].resolvedAmount) {
    return plansWithAmount[plansWithAmount.length - 1];
  }

  // If amount is lower than all plans, pick the lowest plan
  if (amount < plansWithAmount[0].resolvedAmount) {
    return plansWithAmount[0];
  }

  // Otherwise pick the plan whose price is closest to the amount
  return plansWithAmount.reduce((closestPlan, currentPlan) => {
    if (!closestPlan) return currentPlan;

    const currentDiff = Math.abs(currentPlan.resolvedAmount - amount);
    const closestDiff = Math.abs(closestPlan.resolvedAmount - amount);

    return currentDiff < closestDiff ? currentPlan : closestPlan;
  }, null);
};

// Accepts: '06 May 2026', '06-05-2026', '06/05/2026', '2026-05-06', etc.
const parseExcelDate = (value) => {
  if (!value) return { display: "", backend: "" };
  const trimmed = String(value).trim();

  // Try DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD
  let parsed = dayjs(trimmed, ["DD-MM-YYYY", "DD/MM/YYYY", "YYYY-MM-DD"], true);
  if (parsed.isValid()) {
    return {
      display: parsed.format("DD-MM-YYYY"),
      backend: parsed.format("YYYY-MM-DD"),
    };
  }

  // Try '06 May 2026' or '6 May 2026'
  parsed = dayjs(
    trimmed,
    ["D MMM YYYY", "DD MMM YYYY", "D MMMM YYYY", "DD MMMM YYYY"],
    true,
  );
  if (parsed.isValid()) {
    return {
      display: parsed.format("DD-MM-YYYY"),
      backend: parsed.format("YYYY-MM-DD"),
    };
  }

  // Try native Date
  parsed = dayjs(new Date(trimmed));
  if (parsed.isValid()) {
    return {
      display: parsed.format("DD-MM-YYYY"),
      backend: parsed.format("YYYY-MM-DD"),
    };
  }

  // Fallback: show as-is
  return { display: trimmed, backend: trimmed };
};

const getVisibleFieldKeys = (planMappingMethod) => {
  if (planMappingMethod === "samePlan" || planMappingMethod === "amount") {
    return [
      "clientName",
      "mobileNo",
      "paidAmount",
      "joiningDate",
      "gender",
      "discountAmount",
      "pendingAmount",
    ];
  }

  if (planMappingMethod === "planId") {
    return [
      "clientName",
      "mobileNo",
      "paidAmount",
      "joiningDate",
      "gender",
      "discountAmount",
      "pendingAmount",
      "planId",
    ];
  }

  if (planMappingMethod === "planName") {
    return [
      "clientName",
      "mobileNo",
      "paidAmount",
      "joiningDate",
      "gender",
      "discountAmount",
      "pendingAmount",
      "planName",
    ];
  }

  return mappingFieldDefinitions.map((field) => field.key);
};

const getRequiredFieldKeys = (planMappingMethod) => {
  const required = [...BASE_REQUIRED_FIELDS];

  if (planMappingMethod === "planId") {
    required.push("planId");
  }

  if (planMappingMethod === "planName") {
    required.push("planName");
  }

  return required;
};

const SELECT_CLASS =
  "w-full rounded-xl border border-color bg-[var(--background)] dark:bg-[var(--background-dark)] px-3 py-2.5 text-sm text-[var(--text)] dark:text-[var(--text-dark)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15";

function StatCard({ title, value, tone = "default" }) {
  const toneClasses = {
    default:
      "from-slate-50 to-white dark:from-slate-900/30 dark:to-slate-900/10",
    success:
      "from-emerald-50 to-white dark:from-emerald-900/20 dark:to-emerald-950/10",
    warning:
      "from-amber-50 to-white dark:from-amber-900/20 dark:to-amber-950/10",
    danger: "from-rose-50 to-white dark:from-rose-900/20 dark:to-rose-950/10",
  };

  return (
    <div
      className={`rounded-2xl border border-color bg-gradient-to-br ${toneClasses[tone]} px-4 py-4 shadow-sm`}
    >
      <p className="text-xs uppercase tracking-[0.14em] text-light">{title}</p>
      <p className="mt-2 text-3xl font-bold text-[var(--text)] dark:text-[var(--text-dark)]">
        {value}
      </p>
    </div>
  );
}

function BulkUploadMembers() {
  const { planOptions, loading: isPlansLoading } = usePlanOptions();
  const PLAN_BY_ID = useMemo(() => {
    const byId = {};
    (planOptions || []).forEach((plan) => {
      byId[plan.id] = plan;
    });
    return byId;
  }, [planOptions]);
  const inputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [isReading, setIsReading] = useState(false);
  const [isPreparingImport, setIsPreparingImport] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [readError, setReadError] = useState("");
  const [genderEdits, setGenderEdits] = useState({});
  const [cellEdits, setCellEdits] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [importResult, setImportResult] = useState(null);

  const form = useForm({
    mode: "onChange",
    defaultValues: {
      planMappingMethod: "planId",
      samePlan: "",
      mapping: {
        clientName: "",
        mobileNo: "",
        paidAmount: "",
        joiningDate: "",
        gender: "",
        discountAmount: "",
        pendingAmount: "",
        planId: "",
        planName: "",
      },
    },
  });

  const planMappingMethod = form.watch("planMappingMethod");
  const selectedPlan = form.watch("samePlan");
  const mapping = form.watch("mapping");
  const selectedMobileHeader = mapping?.mobileNo || "";
  const selectedClientNameHeader = mapping?.clientName || "";

  const duplicateState = useMemo(() => {
    return detectDuplicateMobiles(
      rows,
      selectedMobileHeader,
      selectedClientNameHeader,
    );
  }, [rows, selectedMobileHeader, selectedClientNameHeader]);

  const requiredMappings = useMemo(() => {
    return getRequiredFieldKeys(planMappingMethod);
  }, [planMappingMethod]);

  const missingMappings = useMemo(() => {
    return requiredMappings.filter((fieldKey) => !mapping?.[fieldKey]);
  }, [requiredMappings, mapping]);

  const visibleFieldKeys = useMemo(
    () => getVisibleFieldKeys(planMappingMethod),
    [planMappingMethod],
  );

  const hasParsedData = headers.length > 0 && rows.length > 0;

  const hasPlans = (planOptions || []).length > 0;

  useEffect(() => {
    setGenderEdits({});
    setCellEdits({});
    setEditingCell(null);
  }, [rows, mapping?.gender]);

  const computedRows = useMemo(() => {
    return rows.map((sourceRow, index) => {
      const mappedRow = {
        rowNumber: index + 2,
      };

      headers.forEach((header) => {
        mappedRow[header] = sourceRow?.[header] ?? "";
      });

      mappingFieldDefinitions.forEach((field) => {
        const sourceHeader = mapping?.[field.key];
        mappedRow[field.key] = sourceHeader
          ? (sourceRow?.[sourceHeader] ?? "")
          : "";
      });

      mappedRow.clientName = String(mappedRow.clientName || "").trim();
      mappedRow.mobileNo = String(mappedRow.mobileNo || "").trim();
      mappedRow.paidAmount = normalizeAmount(mappedRow.paidAmount);
      mappedRow.discountAmount = normalizeAmount(mappedRow.discountAmount);
      mappedRow.pendingAmount = normalizeAmount(mappedRow.pendingAmount);

      // --- DATE HANDLING ---
      const parsedDate = parseExcelDate(mappedRow.joiningDate);
      mappedRow.joiningDate = parsedDate.display;
      mappedRow._joiningDateBackend = parsedDate.backend;

      const hasGenderFromExcel = Boolean(mapping?.gender);
      const excelGender = normalizeGenderFromExcel(mappedRow.gender);

      if (hasGenderFromExcel) {
        mappedRow.gender = excelGender;
        mappedRow.genderSource = "excel";
      } else {
        mappedRow.gender = predictGenderFromName(mappedRow.clientName);
        mappedRow.genderSource = "predicted";
      }

      const totalConsideredAmount =
        Number(mappedRow.paidAmount || 0) +
        Number(mappedRow.pendingAmount || 0);

      const selectedPlanFromSamePlan =
        planMappingMethod === "samePlan" ? PLAN_BY_ID[selectedPlan] : null;
      const selectedPlanFromAmount =
        planMappingMethod === "amount"
          ? resolvePlanFromAmount(totalConsideredAmount, planOptions)
          : null;

      const assignedPlan = selectedPlanFromSamePlan || selectedPlanFromAmount;

      if (planMappingMethod === "samePlan" || planMappingMethod === "amount") {
        mappedRow.planId = assignedPlan?.id || "";
        mappedRow.planName = assignedPlan?.name || assignedPlan?.label || "";
        mappedRow.planAmount = assignedPlan?.price || assignedPlan?.amount || 0;
      } else if (planMappingMethod === "planId") {
        const selectedPlanFromId = PLAN_BY_ID[mappedRow.planId];
        if (selectedPlanFromId && !mappedRow.planName) {
          mappedRow.planName =
            selectedPlanFromId.name || selectedPlanFromId.label;
        }
        mappedRow.planAmount =
          selectedPlanFromId?.price || selectedPlanFromId?.amount || "";
      } else if (planMappingMethod === "planName") {
        const matchedPlan = (planOptions || []).find(
          (plan) =>
            String(plan.name || plan.label).toLowerCase() ===
            String(mappedRow.planName || "").toLowerCase(),
        );
        if (matchedPlan) {
          mappedRow.planId = matchedPlan.id;
          mappedRow.planAmount = matchedPlan.price || matchedPlan.amount;
        }
      }

      // --- DISCOUNT HANDLING ---
      const computedDiscountFromAmount = Math.max(
        0,
        Number(mappedRow.planAmount || 0) - totalConsideredAmount,
      );

      if (Number(mappedRow.discountAmount || 0) < computedDiscountFromAmount) {
        mappedRow.discountAmount = computedDiscountFromAmount;
      }

      const validationIssues = [];
      const isValidJoiningDate =
        mappedRow._joiningDateBackend &&
        dayjs(mappedRow._joiningDateBackend, "YYYY-MM-DD", true).isValid();

      if (!mappedRow.clientName) {
        validationIssues.push("Client Name is missing");
      }
      if (!mappedRow.mobileNo) {
        validationIssues.push("Mobile No. is missing");
      }
      if (!mappedRow.paidAmount || Number(mappedRow.paidAmount) <= 0) {
        validationIssues.push("Paid Amount must be a valid positive number");
      }
      if (!isValidJoiningDate) {
        validationIssues.push(
          "Joining Date must be a valid date in DD-MM-YYYY format",
        );
      }
      if (
        planMappingMethod === "planId" &&
        (!mappedRow.planId || !PLAN_BY_ID[mappedRow.planId])
      ) {
        validationIssues.push("Plan ID is missing or does not match any plan");
      }
      if (
        planMappingMethod === "planName" &&
        !(planOptions || []).some(
          (plan) =>
            String(plan.name || plan.label).toLowerCase() ===
            String(mappedRow.planName || "").toLowerCase(),
        )
      ) {
        validationIssues.push(
          "Plan Name is missing or does not match any plan",
        );
      }
      if (Number(mappedRow.discountAmount) < 0) {
        validationIssues.push("Discount Amount cannot be negative");
      }
      if (Number(mappedRow.pendingAmount) < 0) {
        validationIssues.push("Pending Amount cannot be negative");
      }

      return {
        ...mappedRow,
        validationIssues,
      };
    });
  }, [
    rows,
    headers,
    mapping,
    planMappingMethod,
    selectedPlan,
    planOptions,
    PLAN_BY_ID,
  ]);

  const previewColumns = [
    { key: "srNo", label: "sr no." },
    { key: "clientName", label: "client name" },
    { key: "gender", label: "gender" },
    { key: "mobileNo", label: "mobile number" },
    { key: "paidAmount", label: "amount" },
    { key: "joiningDate", label: "date" },
    { key: "discountAmount", label: "discount amount" },
    { key: "pendingAmount", label: "pending amount" },
    { key: "planName", label: "plan name" },
    { key: "planAmount", label: "plan amount" },
  ];

  const hasRequiredSetup =
    hasParsedData &&
    missingMappings.length === 0 &&
    !(planMappingMethod === "samePlan" && !selectedPlan);

  const isContinueDisabled =
    !hasRequiredSetup || isPreparingImport || isReading;

  const handleCellChange = (rowNumber, fieldKey, value) => {
    setCellEdits((prev) => {
      const updatedEdits = {
        ...prev,
        [rowNumber]: {
          ...(prev[rowNumber] || {}),
          [fieldKey]: value,
        },
      };

      // Get current row from computedRows to get the original plan amount
      const row = computedRows.find((r) => r.rowNumber === rowNumber);
      if (!row) return updatedEdits;

      // Get current values with edits applied
      const currentEdits = updatedEdits[rowNumber] || {};
      const paidAmount =
        currentEdits.paidAmount !== undefined
          ? currentEdits.paidAmount
          : row.paidAmount;
      const discountAmount =
        currentEdits.discountAmount !== undefined
          ? currentEdits.discountAmount
          : row.discountAmount;
      const pendingAmount =
        currentEdits.pendingAmount !== undefined
          ? currentEdits.pendingAmount
          : row.pendingAmount;

      // Formula: Paid + Pending + Discount = Plan

      if (fieldKey === "paidAmount") {
        // When Paid Amount changes: KEEP the entered amount, find the plan based on it
        let newPaid = Number(paidAmount || 0);
        const currentPending = Number(pendingAmount || 0);
        const totalForPlanCalc = newPaid + currentPending;

        const newResolvedPlan = resolvePlanFromAmount(
          totalForPlanCalc,
          planOptions,
        );
        const newPlanAmount =
          newResolvedPlan?.price ||
          newResolvedPlan?.amount ||
          row.planAmount ||
          0;

        // If user entered Paid > Plan, clamp it down
        if (newPaid > newPlanAmount) {
          newPaid = newPlanAmount;
        }

        // Auto-adjust Discount: Discount = Plan - Paid - Pending
        const newDiscount = Math.max(
          0,
          newPlanAmount - newPaid - currentPending,
        );

        updatedEdits[rowNumber].paidAmount = newPaid;
        updatedEdits[rowNumber].discountAmount = newDiscount;
        updatedEdits[rowNumber].planAmount = newPlanAmount;
        updatedEdits[rowNumber].planName =
          newResolvedPlan?.name || newResolvedPlan?.label || row.planName;
        updatedEdits[rowNumber].planId = newResolvedPlan?.id || row.planId;
      } else if (fieldKey === "discountAmount") {
        // When Discount changes: Paid reduces, Pending stays same
        // Paid = Plan - Discount - Pending
        // First, we need to find/calculate the Plan
        const newDiscount = Number(discountAmount || 0);
        const currentPaid = Number(paidAmount || 0);
        const currentPending = Number(pendingAmount || 0);
        const totalForPlanCalc = currentPaid + currentPending;

        const newResolvedPlan = resolvePlanFromAmount(
          totalForPlanCalc,
          planOptions,
        );
        const newPlanAmount =
          newResolvedPlan?.price ||
          newResolvedPlan?.amount ||
          row.planAmount ||
          0;

        // Paid auto-adjusts down: Paid = Plan - Discount - Pending
        const newPaid = Math.max(
          0,
          newPlanAmount - newDiscount - currentPending,
        );
        updatedEdits[rowNumber].paidAmount = newPaid;
        updatedEdits[rowNumber].planAmount = newPlanAmount;
        updatedEdits[rowNumber].planName =
          newResolvedPlan?.name || newResolvedPlan?.label || row.planName;
        updatedEdits[rowNumber].planId = newResolvedPlan?.id || row.planId;
      } else if (fieldKey === "pendingAmount") {
        // When Pending Amount changes: Paid reduces, Discount stays same
        // Paid = Plan - Pending - Discount
        const newPending = Number(pendingAmount || 0);
        const currentPaid = Number(paidAmount || 0);
        const currentDiscount = Number(discountAmount || 0);
        const totalForPlanCalc = currentPaid + newPending;

        const newResolvedPlan = resolvePlanFromAmount(
          totalForPlanCalc,
          planOptions,
        );
        const newPlanAmount =
          newResolvedPlan?.price ||
          newResolvedPlan?.amount ||
          row.planAmount ||
          0;

        // Paid auto-adjusts down: Paid = Plan - Pending - Discount
        const newPaid = Math.max(
          0,
          newPlanAmount - newPending - currentDiscount,
        );
        updatedEdits[rowNumber].paidAmount = newPaid;
        updatedEdits[rowNumber].planAmount = newPlanAmount;
        updatedEdits[rowNumber].planName =
          newResolvedPlan?.name || newResolvedPlan?.label || row.planName;
        updatedEdits[rowNumber].planId = newResolvedPlan?.id || row.planId;
      }

      return updatedEdits;
    });
  };

  const getEditedOrOriginalValue = (row, fieldKey) => {
    return cellEdits[row.rowNumber]?.[fieldKey] !== undefined
      ? cellEdits[row.rowNumber][fieldKey]
      : row[fieldKey];
  };

  const computeRowWithEdits = (row) => {
    let editedRow = { ...row };

    // Apply all cell edits (including pre-calculated plan and amounts)
    if (cellEdits[row.rowNumber]) {
      Object.entries(cellEdits[row.rowNumber]).forEach(([key, value]) => {
        editedRow[key] = value;
      });
    }

    return editedRow;
  };

  const getCalculatedPlanForDisplay = (row) => {
    const editedRow = computeRowWithEdits(row);
    return {
      planId: editedRow.planId,
      planName: editedRow.planName,
      planAmount: editedRow.planAmount,
    };
  };

  const handleMappingChange = (fieldKey, selectedHeader) => {
    const currentMapping = form.getValues("mapping") || {};
    const updatedMapping = { ...currentMapping, [fieldKey]: selectedHeader };

    Object.keys(updatedMapping).forEach((key) => {
      if (key !== fieldKey && updatedMapping[key] === selectedHeader) {
        updatedMapping[key] = "";
      }
    });

    form.setValue("mapping", updatedMapping, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleContinueImport = () => {
    if (!hasRequiredSetup) return;
    if (isPlansLoading || !hasPlans) return;

    setIsPreparingImport(true);

    const duplicateIndexSet = duplicateState.duplicateRowIndexes;

    const mappedRows = computedRows.map((row, index) => {
      // Apply cell edits and recalculate
      const editedRow = computeRowWithEdits(row);
      const isDuplicateMobile = duplicateIndexSet.has(index);
      const isEmptyMobile = !editedRow.mobileNo;
      const hasValidationError = (editedRow.validationIssues || []).length > 0;
      const finalGender = genderEdits[editedRow.rowNumber] || editedRow.gender;
      const planAmount = Number(editedRow.planAmount) || 0;
      const paidAmount = editedRow.paidAmount
        ? Number(editedRow.paidAmount)
        : planAmount;
      const pendingAmount = Number(editedRow.pendingAmount) || 0;

      // Parse edited joining date
      let joiningDateForBackend = editedRow._joiningDateBackend || "";
      if (cellEdits[editedRow.rowNumber]?.joiningDate) {
        const parsedDate = parseExcelDate(
          cellEdits[editedRow.rowNumber].joiningDate,
        );
        joiningDateForBackend = parsedDate.backend;
      }

      let discountAmount = row.discountAmount;
      if (discountAmount === undefined || discountAmount === null) {
        discountAmount = planAmount - paidAmount - pendingAmount;
      }
      if (discountAmount < 0) discountAmount = 0;

      const backendRow = {
        clientName: editedRow.clientName,
        mobileNo: editedRow.mobileNo,
        gender: finalGender,
        paidAmount,
        pendingAmount,
        discountAmount,
        joiningDate: joiningDateForBackend,
        lastRenewalDate: joiningDateForBackend,
        planId: editedRow.planId,
        planName: editedRow.planName,
        planAmount,
      };

      return {
        ...backendRow,
        isDuplicateMobile,
        isEmptyMobile,
        hasValidationError,
      };
    });

    const invalidRows = mappedRows.filter(
      (item) =>
        item.isDuplicateMobile || item.isEmptyMobile || item.hasValidationError,
    );
    const validRows = mappedRows.filter(
      (item) =>
        !item.isDuplicateMobile &&
        !item.isEmptyMobile &&
        !item.hasValidationError,
    );

    if (!validRows.length) {
      makeToast(
        "No valid rows to upload. Please fix the highlighted errors first. | अपलोड करने के लिए कोई मान्य पंक्ति नहीं है। कृपया पहले उजागर की गई त्रुटियों को ठीक करें।",
        "error",
      );
      setIsPreparingImport(false);
      return;
    }

    if (invalidRows.length) {
      makeToast(
        `${validRows.length} rows will be uploaded. ${invalidRows.length} rows were skipped due to errors. | ${validRows.length} पंक्तियां अपलोड की जाएंगी। ${invalidRows.length} पंक्तियां त्रुटियों के कारण छोड़ दी गईं।`,
        "error",
      );
    }

    const payload = {
      clients: validRows,
    };

    bulkImportMembers(payload, {
      onSuccess: (response) => {
        setIsPreparingImport(false);

        if (response?.notInserted?.length > 0) {
          setImportResult(response);
        } else {
          setImportResult(null);
          resetAll();
        }
      },
      onError: () => {
        setIsPreparingImport(false);
      },
      onFinally: () => {
        setIsPreparingImport(false);
      },
    });
  };

  const handleDownloadSampleFile = () => {
    const sampleRows = [
      [
        "Rahul Sharma",
        "9876543210",
        5000,
        "01-01-2026",
        "Male",
        0,
        0,
        "PLAN_ID_1",
        "Basic Plan",
      ],
      [
        "Priya Verma",
        "9123456780",
        3000,
        "15-01-2026",
        "Female",
        500,
        0,
        "PLAN_ID_2",
        "Premium Plan",
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([
      SAMPLE_FILE_HEADERS,
      ...sampleRows,
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
    XLSX.writeFile(workbook, "bulk-upload-sample.xlsx");
  };

  const handleDownloadFailedRows = () => {
    const failedRowsExport = computedRows
      .map((row, index) => {
        const rowIssues = [
          ...(row.validationIssues || []),
          ...(duplicateState.duplicateRowIndexes.has(index)
            ? ["Duplicate mobile number"]
            : []),
          ...(!row.mobileNo ? ["Empty mobile number"] : []),
        ];

        if (!rowIssues.length) return null;

        return {
          "Client Name": row.clientName || "",
          "Mobile No.": row.mobileNo || "",
          "Paid Amount": row.paidAmount || "",
          "Joining Date": row.joiningDate || "",
          Gender: row.gender || "",
          "Discount Amount": row.discountAmount || "",
          "Pending Amount": row.pendingAmount || "",
          "Plan ID": row.planId || "",
          "Plan Name": row.planName || "",
          Reason: rowIssues.join(" | "),
        };
      })
      .filter(Boolean);

    if (!failedRowsExport.length) return;

    const worksheet = XLSX.utils.json_to_sheet(failedRowsExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Failed Rows");
    XLSX.writeFile(workbook, "bulk-upload-failed-rows.xlsx");
  };

  const handleDownloadNotInsertedRows = () => {
    const notInsertedRowsExport = (importResult?.notInserted || []).map(
      (row, index) => ({
        "Row No.": row.rowNumber || row.row_number || index + 1,
        "Client Name": row.clientName || row.client_name || "",
        "Mobile No.": row.mobileNo || row.mobile_no || "",
        Gender: row.gender || "",
        "Paid Amount": row.paidAmount || "",
        "Pending Amount": row.pendingAmount || "",
        "Discount Amount": row.discountAmount || "",
        "Joining Date": row.joiningDate || "",
        "Plan Name": row.planName || "",
        "Plan ID": row.planId || "",
        Reason: row.reason || row.message || "Unknown reason",
      }),
    );

    if (!notInsertedRowsExport.length) return;

    const worksheet = XLSX.utils.json_to_sheet(notInsertedRowsExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Not Inserted");
    XLSX.writeFile(workbook, "bulk-upload-not-inserted.xlsx");
  };

  const handleFileRead = async (file) => {
    if (!file) return;
    if (isPlansLoading || !hasPlans) return;

    setReadError("");
    setIsReading(true);

    try {
      const { headers: detectedHeaders, rows: parsedRows } =
        await parseExcelFile(file);

      setUploadedFile(file);
      setHeaders(detectedHeaders);
      setRows(parsedRows);
      setGenderEdits({});
      setCellEdits({});
      setImportResult(null);

      form.setValue(
        "mapping",
        {
          clientName: "",
          mobileNo: "",
          paidAmount: "",
          joiningDate: "",
          gender: "",
          discountAmount: "",
          pendingAmount: "",
          planId: "",
          planName: "",
        },
        { shouldValidate: true },
      );
    } catch (error) {
      setReadError(
        error?.message ||
          "Unable to read this file. Please upload a valid excel file.",
      );
      setUploadedFile(null);
      setHeaders([]);
      setRows([]);
    } finally {
      setIsReading(false);
    }
  };

  const onDrop = async (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer?.files?.[0];
    await handleFileRead(file);
  };

  const onChooseFile = async (event) => {
    const file = event.target?.files?.[0];
    await handleFileRead(file);
    event.target.value = "";
  };

  const resetAll = () => {
    setUploadedFile(null);
    setHeaders([]);
    setRows([]);
    setGenderEdits({});
    setCellEdits({});
    setEditingCell(null);
    setReadError("");
    setImportResult(null);
    form.reset({
      planMappingMethod: "planId",
      samePlan: "",
      mapping: {
        clientName: "",
        mobileNo: "",
        paidAmount: "",
        joiningDate: "",
        gender: "",
        discountAmount: "",
        pendingAmount: "",
        planId: "",
        planName: "",
      },
    });
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="breadcrumbAndButton">
        <BreadCrumb
          title={"Bulk Upload Members"}
          content={[{ title: "Bulk Upload Members", slug: "#" }]}
        />
      </div>

      <Card className="border border-color rounded-2xl bg-gradient-to-br from-white via-slate-50/60 to-cyan-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 shadow-sm">
        <div className="p-2 space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text)] dark:text-[var(--text-dark)]">
              Bulk Import Setup
            </h2>
            <p className="text-sm text-light mt-1">
              Configure how your Excel data should be imported.
            </p>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 xl:grid-cols-2 md:grid-cols-1 gap-3">
              {PLAN_MAPPING_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = planMappingMethod === method.value;

                return (
                  <label
                    key={method.value}
                    className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                      isSelected
                        ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-[0_10px_24px_rgba(59,130,246,0.12)]"
                        : "border-color bg-[var(--background)] dark:bg-[var(--background-dark)] hover:border-[var(--primary)]/35"
                    }`}
                  >
                    <input
                      type="radio"
                      className="hidden"
                      value={method.value}
                      {...form.register("planMappingMethod")}
                    />

                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-xl border flex items-center justify-center ${
                          isSelected
                            ? "border-[var(--primary)] bg-[var(--primary)]/10"
                            : "border-color"
                        }`}
                      >
                        <Icon className="h-5 w-5 text-[var(--primary)]" />
                      </div>

                      <div>
                        <p className="font-semibold text-[var(--text)] dark:text-[var(--text-dark)] text-sm">
                          {method.title}
                        </p>
                        <p className="text-xs text-light mt-1">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {planMappingMethod === "samePlan" ? (
              <div className="max-w-md">
                <p className="text-xs uppercase tracking-[0.14em] text-light mb-2">
                  Select Plan
                </p>
                <select
                  className={`${SELECT_CLASS} capitalize`}
                  {...form.register("samePlan")}
                >
                  <option value="">Choose plan</option>
                  {(planOptions || []).map((plan) => (
                    <option
                      value={plan.id}
                      key={plan.id}
                      className="capitalize"
                    >
                      {buildPlanLabel(plan)}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </form>
        </div>
      </Card>

      <Card className="border border-color rounded-2xl shadow-sm">
        <div className="p-2 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-[var(--text)] dark:text-[var(--text-dark)]">
              Upload Source File
            </h3>
            <p className="text-sm text-light mt-1">
              Upload .xlsx, .xls, or .csv files to start parsing member data.
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
              Date format must be DD-MM-YYYY.
            </p>
          </div>

          {isPlansLoading ? (
            <div className="rounded-2xl border border-color bg-[var(--background-light)] p-5 text-sm text-light">
              Loading plans...
            </div>
          ) : !hasPlans ? (
            <div className="rounded-2xl border border-red-300 dark:border-red-700/50 bg-red-50/60 dark:bg-red-900/10 p-5">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                Please create a membership plan first before uploading members.
              </p>
              <Link
                to="/membership-plans"
                className="inline-block mt-3 text-sm font-semibold text-[var(--primary)] hover:underline"
              >
                Go to Plans Page
              </Link>
            </div>
          ) : (
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={onDrop}
              className={`rounded-2xl border-2 border-dashed p-8 md:p-5 text-center transition-all ${
                dragActive
                  ? "border-[var(--primary)] bg-[var(--primary)]/5"
                  : "border-color bg-[var(--background-light)]"
              }`}
            >
              <div className="mx-auto h-14 w-14 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center">
                <FaCloudUploadAlt className="h-7 w-7 text-[var(--primary)]" />
              </div>

              <h4 className="mt-4 font-semibold text-[var(--text)] dark:text-[var(--text-dark)]">
                Drag and drop your file here
              </h4>
              <p className="text-sm text-light mt-1">
                or click below to browse
              </p>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                <Button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="h-10 px-5 rounded-xl"
                >
                  Choose File
                </Button>
                <Button
                  type="button"
                  variant="success"
                  onClick={handleDownloadSampleFile}
                  className="h-10 px-5 rounded-xl"
                >
                  <FaFileExcel className="h-4 w-4 mr-2" />
                  Download Sample File
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={onChooseFile}
                />
              </div>

              <p className="mt-3 text-xs text-light">
                Supported: .xlsx, .xls, .csv
              </p>

              {uploadedFile ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-color bg-[var(--background)] px-3 py-1.5">
                  <FaFileExcel className="h-4 w-4 text-[var(--primary)]" />
                  <span className="text-sm text-[var(--text)] dark:text-[var(--text-dark)]">
                    {uploadedFile.name}
                  </span>
                </div>
              ) : null}

              {isReading ? (
                <p className="text-sm text-light mt-4">Reading file...</p>
              ) : null}
              {readError ? (
                <p className="text-sm text-red-500 mt-4">{readError}</p>
              ) : null}
            </div>
          )}
        </div>
      </Card>

      {headers.length ? (
        <Card className="border border-color rounded-2xl shadow-sm">
          <div className="">
            <h3 className="text-base font-semibold text-[var(--text)] dark:text-[var(--text-dark)]">
              Detected Excel Columns
            </h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {headers.map((header) => (
                <span
                  key={header}
                  className="rounded-full border border-color bg-[var(--background-light)] px-3 py-1 text-xs font-medium text-[var(--text)] dark:text-[var(--text-dark)]"
                >
                  {header}
                </span>
              ))}
            </div>
          </div>
        </Card>
      ) : null}

      {headers.length ? (
        <Card className="border border-color rounded-2xl shadow-sm">
          <div className="p-2 space-y-4">
            <h3 className="text-base font-semibold text-[var(--text)] dark:text-[var(--text-dark)]">
              Column Mapping
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {mappingFieldDefinitions
                .filter((field) => visibleFieldKeys.includes(field.key))
                .map((field) => {
                  const selectedValue = mapping?.[field.key] || "";
                  const selectedInOtherFields = Object.entries(mapping || {})
                    .filter(
                      ([key, value]) => key !== field.key && Boolean(value),
                    )
                    .map(([, value]) => value);

                  const availableHeaders = headers.filter(
                    (header) =>
                      header === selectedValue ||
                      !selectedInOtherFields.includes(header),
                  );
                  const isFieldRequired = requiredMappings.includes(field.key);
                  const isMissingRequired =
                    isFieldRequired && !selectedValue && hasParsedData;

                  return (
                    <div
                      key={field.key}
                      className={`rounded-xl border p-3 bg-[var(--background-light)] ${
                        isMissingRequired
                          ? "border-red-300 dark:border-red-700/60 bg-red-50/50 dark:bg-red-900/10"
                          : "border-color"
                      }`}
                    >
                      <label className="text-sm font-medium text-[var(--text)] dark:text-[var(--text-dark)] block mb-2">
                        {field.label}
                        {isFieldRequired ? (
                          <span className="text-red-600 ml-1">*</span>
                        ) : null}
                      </label>
                      <select
                        className={SELECT_CLASS}
                        value={selectedValue}
                        onChange={(event) =>
                          handleMappingChange(field.key, event.target.value)
                        }
                      >
                        <option value="">Select excel column</option>
                        {availableHeaders.map((header) => (
                          <option value={header} key={header}>
                            {header}
                          </option>
                        ))}
                      </select>
                      {field.key === "joiningDate" ? (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                          Only DD-MM-YYYY is allowed.
                        </p>
                      ) : null}
                    </div>
                  );
                })}
            </div>

            {missingMappings.length ? (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Missing required mappings: {missingMappings.join(", ")}
              </p>
            ) : null}
          </div>
        </Card>
      ) : null}

      {headers.length ? (
        <Card className="border border-color rounded-2xl shadow-sm">
          <div className="p-2 space-y-4">
            <h3 className="text-base font-semibold text-[var(--text)] dark:text-[var(--text-dark)]">
              Data Preview (Updated Rows)
            </h3>

            <div className="overflow-auto rounded-xl border border-color max-h-[460px]">
              <table className="min-w-[1100px] w-full text-sm">
                <thead className="sticky top-0 bg-[var(--background-light)] z-10">
                  <tr>
                    {previewColumns.map((column) => (
                      <th
                        key={column.key}
                        className="px-3 py-2 text-left font-semibold border-b border-color whitespace-nowrap capitalize"
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {computedRows.map((row, index) => {
                    const isDuplicate =
                      duplicateState.duplicateRowIndexes.has(index);
                    const hasRowError = (row.validationIssues || []).length > 0;
                    const isInvalidRow = isDuplicate || hasRowError;

                    return (
                      <tr
                        key={`preview_${index}`}
                        className={`border-b border-color ${
                          isInvalidRow ? "bg-red-50/80 dark:bg-red-900/15" : ""
                        }`}
                      >
                        {previewColumns.map((column) => {
                          if (column.key === "srNo") {
                            const isValidRow = !isInvalidRow;
                            return (
                              <td
                                key={`${index}_${column.key}`}
                                className="px-3 py-2 whitespace-nowrap"
                              >
                                <div className="flex items-center gap-2">
                                  <span>{index + 1}</span>
                                  {isValidRow && (
                                    <FaCheckCircle
                                      className="h-4 w-4 text-emerald-500"
                                      title="No errors"
                                    />
                                  )}
                                </div>
                              </td>
                            );
                          }

                          if (column.key === "gender") {
                            const effectiveGender =
                              genderEdits[row.rowNumber] || row.gender;
                            const sourceLabel =
                              row.genderSource === "excel"
                                ? "From Excel"
                                : "Predicted";

                            return (
                              <td
                                key={`${index}_${column.key}`}
                                className="px-3 py-2 whitespace-nowrap"
                              >
                                <div className="flex flex-col gap-2">
                                  <span className="inline-flex w-fit rounded-full border border-color bg-[var(--background-light)] px-2 py-0.5 text-[11px] font-medium text-light">
                                    {sourceLabel}
                                  </span>
                                  <div className="flex items-center gap-3">
                                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-sm">
                                      <input
                                        type="radio"
                                        name={`gender_${row.rowNumber}`}
                                        checked={effectiveGender === "male"}
                                        onChange={() => {
                                          setGenderEdits((prev) => ({
                                            ...prev,
                                            [row.rowNumber]: "male",
                                          }));
                                        }}
                                      />
                                      <span>Male</span>
                                    </label>
                                    <label className="inline-flex items-center gap-1.5 cursor-pointer text-sm">
                                      <input
                                        type="radio"
                                        name={`gender_${row.rowNumber}`}
                                        checked={effectiveGender === "female"}
                                        onChange={() => {
                                          setGenderEdits((prev) => ({
                                            ...prev,
                                            [row.rowNumber]: "female",
                                          }));
                                        }}
                                      />
                                      <span>Female</span>
                                    </label>
                                  </div>
                                </div>
                              </td>
                            );
                          }

                          // Non-editable columns (Plan fields auto-calculated from amounts)
                          if (
                            column.key === "planName" ||
                            column.key === "planAmount"
                          ) {
                            const calculatedPlan =
                              getCalculatedPlanForDisplay(row);
                            const displayValue =
                              column.key === "planName"
                                ? calculatedPlan.planName
                                : calculatedPlan.planAmount;

                            return (
                              <td
                                key={`${index}_${column.key}`}
                                className="px-3 py-2 whitespace-nowrap capitalize bg-slate-50/50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400"
                              >
                                {String(displayValue ?? "")}
                              </td>
                            );
                          }

                          // Editable columns
                          const editValue = getEditedOrOriginalValue(
                            row,
                            column.key,
                          );
                          const isAmountField = [
                            "paidAmount",
                            "discountAmount",
                            "pendingAmount",
                          ].includes(column.key);
                          const cellId = `${row.rowNumber}_${column.key}`;
                          const isEditingThisCell = editingCell === cellId;

                          return (
                            <td
                              key={`${index}_${column.key}`}
                              className="px-3 py-2 whitespace-nowrap"
                            >
                              {isEditingThisCell ? (
                                <input
                                  autoFocus
                                  type={isAmountField ? "number" : "text"}
                                  value={String(editValue ?? "")}
                                  onChange={(e) => {
                                    const newValue = isAmountField
                                      ? e.target.value === ""
                                        ? ""
                                        : Number(e.target.value)
                                      : e.target.value;
                                    handleCellChange(
                                      row.rowNumber,
                                      column.key,
                                      newValue,
                                    );
                                  }}
                                  onBlur={() => setEditingCell(null)}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") setEditingCell(null);
                                    if (e.key === "Escape")
                                      setEditingCell(null);
                                  }}
                                  className="w-24 box-border px-2 py-1 rounded border border-[var(--primary)] bg-white dark:bg-slate-800 text-sm text-[var(--text)] dark:text-[var(--text-dark)] outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                                />
                              ) : (
                                <div
                                  onClick={() => setEditingCell(cellId)}
                                  className="cursor-pointer px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
                                  title="Click to edit"
                                >
                                  {isAmountField
                                    ? String(editValue ?? "").length > 0
                                      ? editValue
                                      : "-"
                                    : String(editValue ?? "")}
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      ) : null}

      {computedRows.some(
        (row) =>
          row.validationIssues?.length ||
          duplicateState.duplicateRowIndexes.has(row.rowNumber - 2) ||
          !row.mobileNo,
      ) && (
        <Card className="border border-red-300 dark:border-red-700/40 rounded-2xl shadow-sm bg-red-50/50 dark:bg-red-900/10">
          <div className="p- space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-base font-semibold text-red-700 dark:text-red-400">
                Row Validation Issues | कुछ Rows में Error है
              </h3>
              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadFailedRows}
                className="h-9 rounded-xl px-3"
              >
                Download Failed Rows
              </Button>
            </div>
            <div className="space-y-2">
              {computedRows.map((row, index) => {
                const rowIssues = [
                  ...(row.validationIssues || []),
                  ...(duplicateState.duplicateRowIndexes.has(index)
                    ? ["Duplicate mobile number"]
                    : []),
                  ...(!row.mobileNo ? ["Empty mobile number"] : []),
                ];

                const issueTranslations = {
                  "Duplicate mobile number":
                    "Duplicate mobile number | यह Mobile Number पहले से मौजूद है",

                  "Empty mobile number":
                    "Empty mobile number | कृपया Mobile Number भरें",
                };
                return rowIssues.length ? (
                  <div
                    key={`issue_${index}`}
                    className="rounded-xl border border-red-200 dark:border-red-700/40 bg-white/70 dark:bg-slate-900/30 p-3"
                  >
                    <p className="text-sm font-semibold text-red-700 dark:text-red-300">
                      Row {row.rowNumber} ({index + 1}):
                    </p>
                    <ul className="mt-1 list-disc pl-5 text-sm text-red-700 dark:text-red-300">
                      {rowIssues.map((issue, issueIndex) => (
                        <li key={`${row.rowNumber}_${issueIndex}`}>
                          {issueTranslations[issue] || issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        </Card>
      )}

      {importResult?.notInserted?.length > 0 && (
        <Card className="border border-red-300 rounded-2xl shadow-sm bg-red-50/50 dark:bg-red-900/10">
          <div className="p-5 md:p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-red-700 dark:text-red-400">
                  Not Inserted Rows ({importResult.notInserted.length}) | डाली
                  नहीं गई पंक्तियां ({importResult.notInserted.length})
                </h3>
                <p className="text-sm text-light mt-1">
                  {importResult?.action
                    ? "These rows were skipped during import. | ये पंक्तियां आयात के दौरान छोड़ दी गईं।"
                    : "These rows could not be inserted. | इन पंक्तियों को डाला नहीं जा सका।"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownloadNotInsertedRows}
                  className="h-9 rounded-xl px-3"
                >
                  <FaFileExcel className="h-4 w-4 mr-2" />
                  Download Excel
                </Button>
                <button
                  onClick={() => setImportResult(null)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  ✕ Close
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              <StatCard
                title="Inserted Count"
                value={importResult.insertedCount ?? 0}
                tone="success"
              />
              <StatCard
                title="Not Inserted"
                value={importResult.notInserted.length}
                tone="danger"
              />
            </div>

            <div className="overflow-auto rounded-xl border border-red-200 max-h-[360px]">
              <table className="min-w-full w-full text-sm">
                <thead className="sticky top-0 bg-red-100 dark:bg-red-900/30 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold border-b border-red-300 whitespace-nowrap">
                      Row No.
                    </th>
                    <th className="px-3 py-2 text-left font-semibold border-b border-red-300 whitespace-nowrap">
                      Client Name
                    </th>
                    <th className="px-3 py-2 text-left font-semibold border-b border-red-300 whitespace-nowrap">
                      Mobile No.
                    </th>
                    <th className="px-3 py-2 text-left font-semibold border-b border-red-300 whitespace-nowrap">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {importResult.notInserted.map((row, index) => (
                    <tr
                      key={`not_inserted_${index}`}
                      className="border-b border-red-200 bg-red-50/70 dark:bg-red-900/15"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {row.rowNumber || row.row_number || index + 1}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {row.clientName || row.client_name || "-"}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {row.mobileNo || row.mobile_no || "-"}
                      </td>
                      <td className="px-3 py-2 text-red-700 dark:text-red-300">
                        {row.reason || row.message || "Unknown reason"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-4 lg:grid-cols-2 md:grid-cols-1 gap-3">
        <StatCard title="Total Rows" value={rows.length} />
        <StatCard
          title="Valid Rows"
          value={Math.max(rows.length - duplicateState.duplicates.length, 0)}
          tone="success"
        />
        <StatCard
          title="Duplicate Rows"
          value={duplicateState.duplicates.length}
          tone="danger"
        />
        <StatCard
          title="Empty Mobile Rows"
          value={duplicateState.emptyMobileRows}
          tone="warning"
        />
      </div>

      <div className="space-y-3">
        {computedRows.some(
          (row, index) =>
            row.validationIssues?.length ||
            duplicateState.duplicateRowIndexes.has(index) ||
            !row.mobileNo,
        ) && (
          <div className="rounded-xl border border-amber-200 dark:border-amber-700/40 bg-amber-50/60 dark:bg-amber-900/15 p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <FaExclamationTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>

              <div>
                <p className="font-semibold text-amber-700 dark:text-amber-300 text-sm">
                  Errors found in some rows | कुछ Rows में Error मिला
                </p>

                <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                  Please fix the highlighted errors below before uploading. Only
                  rows without errors will be imported, and rows with errors
                  will be skipped.
                  <br />
                  <span className="block mt-1">
                    Upload करने से पहले नीचे दिख रहे Errors को ठीक करें। सिर्फ
                    जिन Rows में कोई Error नहीं होगा, वही Import होंगी। जिन Rows
                    में Error होगा, उन्हें Skip कर दिया जाएगा।
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 rounded-xl px-4"
            onClick={resetAll}
          >
            <FaSyncAlt className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <Button
            type="button"
            className="h-10 rounded-xl px-5"
            disabled={isContinueDisabled}
            onClick={handleContinueImport}
          >
            {isPreparingImport ? "Preparing Payload..." : "Continue Import"}
            <FaArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BulkUploadMembers;
