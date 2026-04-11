import { Link } from "react-router-dom";

function SubDropDown({
  data,
  isSubDropDownActive,
  //   child
  activeChildLink,
  setActiveChildLink,
}) {
  return (
    <>
      <ul
        className={`${
          isSubDropDownActive
            ? "showSubDropDown max-h-[1000px]"
            : "max-h-0 overflow-hidden"
        } dropDownContent dropDownContentTwo`}
      >
        {data?.map((item, i) => {
          return (
            <li className="subDropDownNavItem" key={i + 1}>
              <Link
                to={item.link}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveChildLink({ active: true, link: item.title });
                }}
                className={` ${
                  activeChildLink.active && activeChildLink.link === item.title
                    ? "active"
                    : ""
                } capitalize subDropDownNavLink dropDownNavLink flex items-center  justify-between w-full`}
              >
                {item.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default SubDropDown;
