import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
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

  // If amount is less than all plans, pick the closest lower (first plan)
  if (amount < plansWithAmount[0].resolvedAmount) {
    return plansWithAmount[0];
  }

  // If amount is more than all plans, pick the next higher (last plan)
  if (amount > plansWithAmount[plansWithAmount.length - 1].resolvedAmount) {
    return plansWithAmount[plansWithAmount.length - 1];
  }

  // Find the first plan whose amount is >= amount
  for (let i = 0; i < plansWithAmount.length; i++) {
    if (amount <= plansWithAmount[i].resolvedAmount) {
      return plansWithAmount[i];
    }
  }

  // Fallback (should not reach here)
  return plansWithAmount[plansWithAmount.length - 1];
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
  const [rejectedRows, setRejectedRows] = useState([]);

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

  const duplicateState = useMemo(() => {
    return detectDuplicateMobiles(rows, selectedMobileHeader);
  }, [rows, selectedMobileHeader]);

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

  const hasRequiredSetup =
    hasParsedData &&
    missingMappings.length === 0 &&
    !(planMappingMethod === "samePlan" && !selectedPlan);

  const isContinueDisabled =
    !hasRequiredSetup || isPreparingImport || isReading;

  const hasPlans = (planOptions || []).length > 0;

  useEffect(() => {
    setGenderEdits({});
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

      const selectedPlanFromSamePlan =
        planMappingMethod === "samePlan" ? PLAN_BY_ID[selectedPlan] : null;
      const selectedPlanFromAmount =
        planMappingMethod === "amount"
          ? resolvePlanFromAmount(mappedRow.paidAmount, planOptions)
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
      // If discount is missing/0 and planAmount > paidAmount, auto-calc
      if (
        (!mappedRow.discountAmount || mappedRow.discountAmount === 0) &&
        mappedRow.planAmount > mappedRow.paidAmount
      ) {
        mappedRow.discountAmount = mappedRow.planAmount - mappedRow.paidAmount;
      }

      return mappedRow;
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
      const isDuplicateMobile = duplicateIndexSet.has(index);
      const isEmptyMobile = !row.mobileNo;
      const finalGender = genderEdits[row.rowNumber] || row.gender;
      const planAmount = Number(row.planAmount) || 0;
      const paidAmount = row.paidAmount ? Number(row.paidAmount) : planAmount;
      const pendingAmount = Number(row.pendingAmount) || 0;
      // Use backend date format
      const joiningDateForBackend = row._joiningDateBackend || "";

      let discountAmount = row.discountAmount;
      if (discountAmount === undefined || discountAmount === null) {
        discountAmount = planAmount - paidAmount - pendingAmount;
      }
      if (discountAmount < 0) discountAmount = 0;

      const backendRow = {
        clientName: row.clientName,
        mobileNo: row.mobileNo,
        gender: finalGender,
        paidAmount,
        pendingAmount,
        discountAmount,
        joiningDate: joiningDateForBackend,
        lastRenewalDate: joiningDateForBackend,
        planId: row.planId,
        planName: row.planName,
        planAmount,
      };

      return {
        ...backendRow,
        isDuplicateMobile,
        isEmptyMobile,
      };
    });

    const validRows = mappedRows.filter(
      (item) => !item.isDuplicateMobile && !item.isEmptyMobile,
    );

    const payload = {
      clients: validRows,
    };

    bulkImportMembers(payload, {
      onSuccess: (response) => {
        setIsPreparingImport(false);

        // Handle rejected rows if any
        if (response?.rejectedRows?.length > 0) {
          setRejectedRows(response.rejectedRows);
          console.log("Rejected rows ->", response.rejectedRows);
        } else {
          // Only reset if all rows were imported successfully
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
    setReadError("");
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
        <div className="p-5 md:p-4 space-y-5">
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
                <select className={SELECT_CLASS} {...form.register("samePlan")}>
                  <option value="">Choose plan</option>
                  {(planOptions || []).map((plan) => (
                    <option value={plan.id} key={plan.id}>
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
        <div className="p-5 md:p-4 space-y-4">
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

              <div className="mt-4">
                <Button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="h-10 px-5 rounded-xl"
                >
                  Choose File
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
          <div className="p-5 md:p-4">
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
          <div className="p-5 md:p-4 space-y-4">
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

      {duplicateState.duplicates.length ? (
        <Card className="border border-red-200 dark:border-red-700/40 rounded-2xl shadow-sm">
          <div className="p-5 md:p-4 space-y-4">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <FaExclamationTriangle className="h-5 w-5" />
              <h3 className="text-base font-semibold">
                Duplicate Mobile Errors
              </h3>
            </div>

            <div className="overflow-x-auto rounded-xl border border-red-200 dark:border-red-700/40">
              <table className="min-w-full text-sm">
                <thead className="bg-red-50 dark:bg-red-900/20 text-left">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Row Number</th>
                    <th className="px-3 py-2 font-semibold">Mobile Number</th>
                    <th className="px-3 py-2 font-semibold">Error Message</th>
                  </tr>
                </thead>
                <tbody>
                  {duplicateState.duplicates.map((item, index) => (
                    <tr
                      key={`${item.mobile}_${item.rowNumber}_${index}`}
                      className="border-t border-red-200/60 dark:border-red-700/40"
                    >
                      <td className="px-3 py-2">Row {item.rowNumber}</td>
                      <td className="px-3 py-2">{item.mobile}</td>
                      <td className="px-3 py-2">{item.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      ) : null}

      {headers.length ? (
        <Card className="border border-color rounded-2xl shadow-sm">
          <div className="p-5 md:p-4 space-y-4">
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

                    return (
                      <tr
                        key={`preview_${index}`}
                        className={`border-b border-color/70 ${
                          isDuplicate ? "bg-red-50/70 dark:bg-red-900/15" : ""
                        }`}
                      >
                        {previewColumns.map((column) => {
                          if (column.key === "srNo") {
                            return (
                              <td
                                key={`${index}_${column.key}`}
                                className="px-3 py-2 whitespace-nowrap"
                              >
                                {index + 1}
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

                          return (
                            <td
                              key={`${index}_${column.key}`}
                              className="px-3 py-2 whitespace-nowrap capitalize"
                            >
                              {String(row?.[column.key] ?? "")}
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

      {rejectedRows.length > 0 && (
        <Card className="border border-red-300 rounded-2xl shadow-sm bg-red-50/50 dark:bg-red-900/10">
          <div className="p-5 md:p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-red-700 dark:text-red-400">
                Rejected Rows ({rejectedRows.length})
              </h3>
              <button
                onClick={() => setRejectedRows([])}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                ✕ Close
              </button>
            </div>

            <div className="overflow-auto rounded-xl border border-red-200 max-h-[300px]">
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
                      Rejection Reason
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedRows.map((row, index) => (
                    <tr
                      key={`rejected_${index}`}
                      className="border-b border-red-200 hover:bg-red-100/50 dark:hover:bg-red-900/20"
                    >
                      <td className="px-3 py-2 whitespace-nowrap">
                        {row.rowNumber || row.row_number || "-"}
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
  );
}

export default BulkUploadMembers;
