import {
  FaAngleDoubleLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleRight,
} from "react-icons/fa";
import Card from "../Card/Card";
import Showing from "./Showing";

function Pagination({ dataInDb, limit, page, setPage, multyCheckData }) {
  const totalPages = Math.ceil(dataInDb / limit);

  // if (totalPages <= 1) return null;

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);
  };

  // ONLY: prev, current, next
  const getPages = () => {
    let pages = [];

    if (page > 1) pages.push(page - 1);

    pages.push(page);

    if (page < totalPages) pages.push(page + 1);

    return pages;
  };

  return (
    <Card className=" !rounded-t-none !border-t-0" isBorder>
      <div className="flex justify-between items-center ">
        {/* LEFT */}
        {/* <div className="flex items-center gap-3 text-sm">
          <span className=" font-medium">Row Per Page</span>

          <div className="relative">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(e.target.value);
              }}
              className="appearance-none px-4 py-2 pr-8 rounded-lg border 
                 border bg-[var(--background)] 
                  font-medium
                 focus:outline-none 
                 focus:border-[var(--primary)] 
                 focus:ring-2 
                 focus:ring-[var(--primary)]/20
                 transition cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
              ▾
            </div>
          </div>

          <span className="">Entries</span>
        </div> */}

        <Showing
          dataInDb={dataInDb}
          limit={limit}
          multyCheckData={multyCheckData}
        />
        {/* RIGHT */}
        <div className="flex items-center gap-2">
          {/* First */}
          <button
            onClick={() => goToPage(1)}
            disabled={page === 1}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[var(--primary)] disabled:opacity-30 transition"
          >
            <FaAngleDoubleLeft />
          </button>

          {/* Prev */}
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[var(--primary)] disabled:opacity-30 transition"
          >
            <FaAngleLeft />
          </button>

          {/* Numbers */}
          {getPages().map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition
        ${
          p === page
            ? "bg-[var(--primary)] text-white shadow-md"
            : " hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
        }`}
            >
              {p}
            </button>
          ))}

          {/* Next */}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[var(--primary)] disabled:opacity-30 transition"
          >
            <FaAngleRight />
          </button>

          {/* Last */}
          <button
            onClick={() => goToPage(totalPages)}
            disabled={page === totalPages}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-[var(--primary)] disabled:opacity-30 transition"
          >
            <FaAngleDoubleRight />
          </button>
        </div>
      </div>
    </Card>
  );
}

export default Pagination;
