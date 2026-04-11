import { FaAngleRight } from "react-icons/fa";

function SideBarSettings({ theme, setTheme }) {
  return (
    <>
      <div
        className={`sideBarButtons z-10 flex  justify-center items-center cursor-pointer  absolute bottom-3 ${
          theme.isSideBarSmall ? "right-3.5" : "right-2"
        }    w-[26px] h-[26px] bg-[var(--background-light)] rounded-full p-2`}
      >
        <button
          onClick={() => {
            setTheme((prev) => {
              return { ...prev, isSideBarSmall: !theme.isSideBarSmall };
            });
          }}
          className={`${
            theme.isSideBarSmall ? "rotate-0" : "rotate-180"
          } toggleButton group-hover:block `}
        >
          <FaAngleRight className="dark:text-white" />
        </button>
      </div>
    </>
  );
}

export default SideBarSettings;
