import { BsGrid } from "react-icons/bs";
import { FaListCheck } from "react-icons/fa6";

function Tabs({ setView, view, className }) {
  return (
    <div className={className}>
      {" "}
      <div className="flex shrink-0 border border-color rounded-md overflow-hidden w-fit">
        <button
          onClick={() => setView("table")}
          className={`px-4 py-2.5 text-sm transition border-l border-color
    ${
      view === "table"
        ? "bg-[var(--primary)] text-white"
        : "bg-transparent text-[var(--text)] hover:bg-[var(--background-light)] "
    }`}
        >
          <FaListCheck size={14} />
        </button>
        <button
          onClick={() => setView("grid")}
          className={`px-4 py-2.5 text-sm transition 
    ${
      view === "grid"
        ? "bg-[var(--primary)] text-white"
        : "bg-transparent text-[var(--text)] hover:bg-[var(--background-light)] "
    }`}
        >
          <BsGrid size={14} />
        </button>
      </div>
    </div>
  );
}

export default Tabs;
