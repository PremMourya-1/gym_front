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
      <div className="flex justify-between items-center sm:flex-col sm:gap-4">
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
