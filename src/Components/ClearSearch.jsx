import { IoIosClose } from "react-icons/io";

function ClearSearch({ setSearch, search }) {
  return (
    search && (
      <span
        className="clear absolute right-2 top-1/2 -translate-y-1/2 text-lg cursor-pointer hover:text-blue-400"
        onClick={() => {
          setSearch("");
        }}
      >
        <IoIosClose />
      </span>
    )
  );
}

export default ClearSearch;
