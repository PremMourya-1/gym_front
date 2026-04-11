import { useState, useEffect } from "react";
import PreLoader from "../Common/Loader/PreLoader";
import NoRecords from "../NoRecords/NoRecords";

function Table({
  columns,
  data,
  multyCheck,
  setMultyCheck,
  stickyEnabled = true, // ✅ New prop, default true
  isHeaderColor,
  isRounded,
  isBorder,
  page = 1, // 👈 add this
  limit = 10, // 👈 add this
}) {
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (!data?.length) return;
    setSelectAll(multyCheck?.length === data?.length);
  }, [multyCheck, data]);

  useEffect(() => {
    setMultyCheck?.([]);
  }, []);

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked)
      setMultyCheck(data); // ✅ pura data add
    else setMultyCheck([]); // ✅ clear all
  };

  const handleSingleCheck = (row) => {
    const exists = multyCheck?.some((r) => r.id === row.id); // ✅ id se check
    if (exists) {
      // agar already hai, remove kar do
      setMultyCheck(multyCheck.filter((r) => r.id !== row.id));
    } else {
      // agar nahi hai, add kar do
      setMultyCheck([...multyCheck, row]);
    }
  };

  const fixedCols = columns.filter((c) => c.width);
  const flexibleCols = columns.filter((c) => !c.width);
  const totalFixedWidth = fixedCols.reduce(
    (acc, col) => acc + parseInt(col.width || 0),
    0,
  );
  const autoWidth =
    flexibleCols.length > 0
      ? `calc((100% - ${totalFixedWidth}px) / ${flexibleCols.length})`
      : "auto";

  return (
    <>
      <div
        className={`overflow-x-auto ${isBorder ? "border border-[color:var(--border)]" : ""} ${stickyEnabled ? "sticky" : ""} ${isRounded ? "rounded-lg" : ""} `}
      >
        <table
          className={`customTable ${isHeaderColor ? "color" : ""} rounded-lg text-left w-full`}
        >
          <thead>
            <tr >
              {/* Sticky Sr No + Checkbox Header */}
              <th
                className={`${stickyEnabled
                  ? `sticky left-0 z-30 ${isHeaderColor ? "bg-[var(--primary-light)]" : "bg-[color:var(--background-light)]"} `
                  : ""
                  } font-medium text-center w-[70px]`}
                style={{
                  width: "70px",
                  minWidth: "70px",
                  maxWidth: "70px",
                }}
              >
                {multyCheck ? (
                  <div className="relative group flex justify-center">
                    {!selectAll && (
                      <span className="group-hover:hidden">Sr No.</span>
                    )}
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className={`${selectAll ? "block" : "hidden group-hover:block"
                        } w-4 h-4 accent-[color:var(--primary)] cursor-pointer`}
                    />
                  </div>
                ) : (
                  "Sr No."
                )}
              </th>

              {columns.map((item, i) => {
                const stickyClass =
                  stickyEnabled && item.fixed === "left"
                    ? "sticky left-[70px] z-20 "
                    : stickyEnabled && item.fixed === "right"
                      ? `sticky right-0 z-20 ${isHeaderColor ? "bg-[var(--primary-light)]" : "bg-[color:var(--background-light)]"} `
                      : "";

                return (
                  <th
                    key={i}
                    className={`capitalize font-medium ${stickyClass}`}
                    style={{
                      width: item.width || autoWidth,
                      minWidth: item.width || autoWidth,
                    }}
                  >
                    {typeof item.title === "function"
                      ? item.title(item)
                      : item.title}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {data?.map((item, i) => {
              const srNo = (page - 1) * limit + (i + 1);
              const isChecked = multyCheck?.some((obj) => obj.id === item.id);

              return (
                <tr key={i} className={`
                      group
                      ${item.expired < 0
                    ? "!bg-red-100 dark:!bg-red-900/30"
                    : ""
                  }
                    `}>
                  <td
                    className={`${stickyEnabled
                      ? "sticky left-0 z-20 bg-[color:var(--background-light)]"
                      : ""
                      } text-center font-medium w-[70px]`}
                  >
                    {multyCheck ? (
                      <div className="relative group flex justify-center items-center">
                        {!isChecked && (
                          <span className="group-hover:hidden">{srNo}</span>
                        )}
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleSingleCheck(item)}
                          className={`${isChecked ? "block" : "hidden group-hover:block"
                            } w-4 h-4 accent-[color:var(--primary)] cursor-pointer`}
                        />
                      </div>
                    ) : (
                      <p>{srNo}</p>
                    )}
                  </td>

                  {columns.map((col, index) => {
                    const stickyClass =
                      stickyEnabled && col.fixed === "left"
                        ? "sticky left-[70px] z-10"
                        : stickyEnabled && col.fixed === "right"
                          ? "sticky right-0 z-10"
                          : "";

                    return (
                      <td
                        key={index}
                        className={`text-sm font-medium ${stickyClass}`}
                        style={{
                          width: col.width || autoWidth,
                          minWidth: col.width || autoWidth,
                        }}
                      >
                        {col.selector(item, i)}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data ? (
        data?.length ? (
          ""
        ) : (
          <div className="">
            <NoRecords />
          </div>
        )
      ) : (
        <PreLoader />
      )}
    </>
  );
}

export default Table;
