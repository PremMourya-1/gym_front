import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HiDotsHorizontal } from "react-icons/hi";
import { FiEdit } from "react-icons/fi";
import { IoTrashBinOutline } from "react-icons/io5";
function DropDown() {
  return (
    <>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="">
            <HiDotsHorizontal className="fill-[color:var(--background)] dark:fill-white text-lg" />
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in absolute right-0 z-10 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none "
        >
          <div className="py-1">
            <MenuItem>
              <a
                href="#"
                className="flex gap-2 items-center font-semibold px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                <FiEdit className="text-base stroke-blue-500" /> Edit
              </a>
            </MenuItem>
            <MenuItem>
              <a
                href="#"
                className="flex gap-2 items-center font-semibold px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                <IoTrashBinOutline className="text-base stroke-red-600" />{" "}
                Delete
              </a>
            </MenuItem>
          </div>
        </MenuItems>
      </Menu>
    </>
  );
}

export default DropDown;
