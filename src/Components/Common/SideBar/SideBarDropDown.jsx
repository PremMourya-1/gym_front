import { useContext } from "react";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../../Context/ThemeContext";

function SideBarDropDown({
  data,
  isShow,
  activeSubLink,
  setActiveSubLink,
  parentTitle,
  //   child
}) {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <>
      <ul
        className={`${
          isShow && !theme.isSideBarSmall
            ? "show max-h-[1000px]"
            : "max-h-0 overflow-hidden"
        } ${
          theme.isSideBarSmall && "group-hover:max-h-[1000px]"
        }  dropDownContent dropDownContentOne`}
      >
        {theme.isSideBarSmall && (
          <li className="dropDownNavItem  px-4 parentTitle capitalize bg-[color:var(--primary-dark)] p-2 text-white">
            {parentTitle}
          </li>
        )}
        {data?.map((item, i) => {
          return (
            <li
              className={`dropDownNavItem  ${
                activeSubLink.link === item.title && activeSubLink.active
                  ? ""
                  : "bg-transparent"
              } `}
              key={item.id || i + 1}
            >
              <Link
                to={item.link}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSubLink({
                    active:
                      activeSubLink.link !== item.title
                        ? true
                        : !activeSubLink.active,
                    link: item.title,
                  });
                  if (window.innerWidth < 768) {
                    setTheme((prev) => {
                      return { ...prev, isSideBarSmall: true };
                    });
                  }
                }}
                className={`  ${
                  activeSubLink.link?.toLowerCase() ===
                  (item.key?.toLowerCase() || item.title?.toLowerCase())
                    ? "active "
                    : ""
                }  capitalize dropDownNavLink  flex items-center  justify-between w-full`}
              >
                {item.title}
                {/* {iscontent ? (
                  <span className="arrow">
                    {
                      <FaAnglesRight
                        className={`${
                          activeSubLink.active &&
                          activeSubLink.link === item.title
                            ? "rotate-90 dark:fill-[color:var(--primary)] fill-[color:var(--primary-dark)]"
                            : ""
                        }  fill-gray-500 h-[12px] `}
                      />
                    }
                  </span>
                ) : (
                  ""
                )} */}
              </Link>
              {/* child drop down */}
              {/* <SubDropDown
                isSubDropDownActive={
                  activeSubLink.active && activeSubLink.link === item.title
                }
                data={item.content}
                activeChildLink={activeChildLink}
                setActiveChildLink={setActiveChildLink}
              /> */}
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default SideBarDropDown;
