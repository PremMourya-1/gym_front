import { MdDelete } from "react-icons/md";
import ActionCell from "./ActionCell";
import { Link } from "react-router-dom";
import { BiSolidEditAlt } from "react-icons/bi";
function ActionDropDown({
  onEditClick,
  onDeleteClick,
  children,
  row,
  editUrl,
  title,
}) {
  return (
    <>
      <ActionCell rowData={row}>
        {(data, onclose) => (
          <ul className="min-w-20 text-sm capitalize ">
            {editUrl ? (
              <Link
                to={editUrl}
                state={row}
                className="flex  gap-2  border-b items-center  hover:bg-[var(--info)]  px-2 py-1.5 dark:!text-white !text-black hover:!text-white cursor-pointer !no-underline"
                onClick={() => {
                  onclose();
                }}
              >
                <BiSolidEditAlt className=" text-lg " />
                Edit {title}
              </Link>
            ) : (
              <li
                className="flex border-b items-center gap-2 hover:bg-[var(--info)] px-2 py-1.5 hover:text-[var(--text-white)] dark:!text-white cursor-pointer"
                onClick={() => {
                  onEditClick(row);
                  onclose();
                }}
              >
                <BiSolidEditAlt className=" text-lg" />
                Edit {title}
              </li>
            )}
            {children}
            <li
              className="flex   items-center gap-2 text-[var(--danger)] hover:bg-[var(--danger)] px-2 py-1.5 hover:text-[var(--text-white)] rounded-sm cursor-pointer"
              onClick={() => {
                onDeleteClick(row);
                onclose();
              }}
            >
              <MdDelete className=" text-lg" />
              Delete {title}
            </li>
          </ul>
        )}
      </ActionCell>
    </>
  );
}

export default ActionDropDown;
