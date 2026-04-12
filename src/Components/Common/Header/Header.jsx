import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import UserProfile from "../UserProfile/UserProfile";
import { months, weekdays } from "../../../Utils/dates";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { FaAnglesLeft, FaRotate } from "react-icons/fa6";
function Header() {
  const { theme, reload, setReload, setTheme } = useContext(ThemeContext);
  const date = new Date();

  const formattedDate = `${weekdays[date.getDay()]} ${date.getDate()} ${
    months[date.getMonth()]
  } ${date.getFullYear()}`;

  const isAdmin = useLocation().pathname.split("/")[1] === "admin";

  const [currentTime, setCurrentTime] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        `${
          new Date().getHours() > 12
            ? Number(new Date().getHours()) - 12 < 10
              ? `0${Number(new Date().getHours()) - 12}`
              : Number(new Date().getHours()) - 12
            : new Date().getHours() < 10
              ? `0${new Date().getHours()}`
              : new Date().getHours()
        }:${
          new Date().getMinutes() < 10
            ? `0${new Date().getMinutes()}`
            : new Date().getMinutes()
        }:${
          new Date().getSeconds() < 10
            ? `0${new Date().getSeconds()}`
            : new Date().getSeconds()
        }`,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  const [isSearching] = useState(false);
  const user = useSelector((state) => state.auth);

  const naviagate = useNavigate();
  const [query, setQuery] = useState("");
  function handleSearch(e) {
    e.preventDefault();
    naviagate(`attendance/student-attendance-record/${query}`);
    setQuery("");
  }
  return (
    <>
      <header
        className={` ${
          theme.isSideBarSmall ? "ms-20 small" : " ms-[260px] md:ms-0 "
        } pt-5 pb-3 px-5 z-20 md:ms-0 md:p-0 `}
      >
        <div className="headerDetails md:!rounded-none flex md:justify-end  md:gap-4 md:items-start justify-between items-center">
          <div className="shrink-0 ">
            <p className="font-medium text-xl text-primary mb-0.5 capitalize flex items-center gap-1 ">
              <button
                onClick={() => {
                  setTheme((prev) => {
                    return { ...prev, isSideBarSmall: !theme.isSideBarSmall };
                  });
                }}
                className={`${
                  theme.isSideBarSmall ? "rotate-180" : "rotate-0"
                } toggleButton group-hover:block `}
              >
                <FaAnglesLeft size={16} />
              </button>{" "}
              {user && !isAdmin ? user.gymName : user?.fullName}
              {/* {user && !isAdmin ? user.ownerName : user?.fullName} */}
            </p>
            <p className="flex items-center gap-2">
              {
                <span
                  className={` ${
                    !currentTime
                      ? "translate-y-4 opacity-0"
                      : "translate-y-0 opacity-100"
                  } text-sm transition-all`}
                >
                  {formattedDate} | {currentTime}
                </span>
              }
            </p>
          </div>

          <div className="last flex gap-4  items-center md:w-full justify-end">
            <div className=" flex  items-center gap-3">
              <form
                action=""
                onSubmit={handleSearch}
                className={`${
                  isSearching ? "w-[200px]  me-3" : "w-0 overflow-hidden"
                } transition3`}
              >
                <div className="inputBox bg-[color:var(--background-light)] dark:bg-[color:var(--background-dark-light)] px-2 rounded-full">
                  <input
                    style={{ borderColor: "transparent", padding: "8px 4px" }}
                    className="formControl border-none"
                    type="text"
                    placeholder="Search..."
                    autoFocus
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                    }}
                  />
                </div>
              </form>
              {/* {!isAdmin && (
                <button
                  onClick={() => {
                    setIsSearching(!isSearching);
                  }}
                  className="circle h-9 w-9  rounded-full bg-light flex items-center justify-center cursor-pointer"
                >
                  {isSearching ? (
                    <IoClose className="svgFillLightBg h-4.5 w-4.5" />
                  ) : (
                    <IoSearch className="svgFillLightBg h-4.5 w-4.5" />
                  )}
                </button>
              )} */}
              <button
                style={{
                  transform: `rotate(${reload * 360}deg)`,
                }}
                onClick={() => {
                  setReload((prev) => prev + 1);
                }}
                className={` transition5  rotate-[360deg] relative h-9 w-9 !rounded-full bg-light flex items-center justify-center cursor-pointer`}
              >
                <FaRotate size={14} className="text-gray-700 dark:text-white" />
              </button>
              <ThemeSwitcher />

              {/* <Notification /> */}
            </div>
            <UserProfile isAdmin={isAdmin} logo={user?.logo} />
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
