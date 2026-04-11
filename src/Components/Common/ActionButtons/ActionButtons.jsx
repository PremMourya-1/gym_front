// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
// import { FiEdit } from "react-icons/fi";
// import { HiDotsHorizontal } from "react-icons/hi";
// import { IoTrashBinOutline } from "react-icons/io5";
import { IoTrashBin } from "react-icons/io5";
import { BiSolidEditAlt } from "react-icons/bi";
import Tippy from "@tippyjs/react";

function ActionButtons({ onEdit, onDelete, data }) {
  return (
    <>
      <div className="flex gap-1 items-center justify-center">
        <Tippy content="Edit Record">
          <button
            onClick={() => {
              onEdit(data);
            }}
            className="flex gap-2 items-center font-semibold p-1.5 hover:bg-gray-300 rounded-md dark:hover:bg-gray-900  text-sm cursor-pointer text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
          >
            <BiSolidEditAlt className="text-xl fill-gray-700 dark:fill-gray-300" />
          </button>
        </Tippy>
        <Tippy content="Delete Record">
          <button
            onClick={() => {
              onDelete(data.id);
            }}
            className="flex gap-2 items-center font-semibold p-1.5 hover:bg-gray-300 rounded-md dark:hover:bg-gray-900  text-sm cursor-pointer text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
          >
            <IoTrashBin className="text-lg fill-red-500 dark:fill-red-500" />
          </button>
        </Tippy>
      </div>
      {/* <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="">
            <HiDotsHorizontal className="fill-[color:var(--background)] dark:fill-white text-lg" />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in absolute right-7 -top-0 z-10 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none "
        >
          <div className="py-1">
            <MenuItem>
              <span
                onClick={() => {
                  onEdit(data);
                }}
                className="flex gap-2 items-center font-semibold px-4 py-2 text-sm cursor-pointer text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                <FiEdit className="text-base stroke-blue-500" /> Edit
              </span>
            </MenuItem>
            <MenuItem>
              <span
                onClick={() => {
                  onDelete(data.id);
                }}
                className="flex gap-2 items-center font-semibold px-4 py-2 text-sm cursor-pointer text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                <IoTrashBinOutline className="text-base stroke-red-600" />{" "}
                Delete
              </span>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu> */}
    </>
  );
}

export default ActionButtons;
