import { useContext, useEffect, useState } from "react";
import SideBarHeader from "./SideBarHeader";
import { Link, useLocation } from "react-router-dom";
import { MdKeyboardArrowRight } from "react-icons/md";
import SideBarDropDown from "./SideBarDropDown";
import { ThemeContext } from "../../../Context/ThemeContext";

import userSideBarData from "../../../Data/UserData/sideBarData";
import adminSideBarData from "../../../Data/AdminData/adminSideBarData";
import { AppDataContext } from "../../../Context/AppDataContext";
import Tippy from "@tippyjs/react";
import "../../../Styles/Sidebar.css"; // optional for styling
function SideBar() {
  const { setTheme, theme } = useContext(ThemeContext);
  const path = useLocation().pathname;
  // const isSoftwareDisable = getLocaleStorageItem("theme")?.disable || false;

  const [sideBarContent, setSideBarContent] = useState([]);
  const {
    appData: { isAdmin },
  } = useContext(AppDataContext);

  useEffect(() => {
    if (isAdmin) {
      setSideBarContent(adminSideBarData);
    } else {
      setSideBarContent(userSideBarData);
    }
  }, [path]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth < 768) {
        setTheme((prev) => {
          return { ...prev, isSideBarSmall: true };
        });
      } else
        setTheme((prev) => {
          return { ...prev, isSideBarSmall: false };
        });
    });
  }, []);

  const [activeLink, setActiveLink] = useState({
    active: true,
    link: "dashboard",
  });

  const [activeSubLink, setActiveSubLink] = useState({
    active: false,
    link: path.split("/")[2],
  });

  useEffect(() => {
    setActiveLink({
      link:
        window.location.pathname.split("/")[
          path.split("/")[1] === "admin" ? 2 : 1
        ] || "dashboard",
      active: true,
    });

    setActiveSubLink({
      active: true,
      link: path
        .split("/")
        ?.[path.split("/")[1] === "admin" ? 3 : 2]?.split("-")
        .join(" "),
    });
  }, [path]);

  return (
    <div className={`dark  `}>
      <aside
        className={`ml-5 mt-5  ${
          theme.isSideBarSmall
            ? "w-14 small md:-translate-x-[100%]"
            : "w-60 overflow-y-scroll md:-translate-x-[0%]"
        } fixed z-50 md:ml-0 md:mt-0 md:h-full `}
        style={
          theme.sidebarBg
            ? {
                backgroundImage: `linear-gradient(rgba(0,0,0,0.425), rgba(21,21,21,0.374)), url("${theme.sidebarBg}")`,
              }
            : undefined
        }
      >
        <SideBarHeader isSideBarSmall={theme.isSideBarSmall} />
        {/* <SideBarSettings theme={theme} setTheme={setTheme} /> */}

        <div className="sideBarContent">
          <ul>
            {sideBarContent.map((item, i) => {
              const iscontent = Boolean(item.content.length);
              return (
                <Tippy
                  key={i + 1}
                  content={
                    <>
                      <span className="capitalize">{item.title}</span>
                    </>
                  }
                  placement="right"
                  disabled={!theme.isSideBarSmall || iscontent}
                >
                  <li
                    key={item.id}
                    onClick={() => {
                      setActiveLink({
                        active:
                          activeLink.link === item.title
                            ? !activeLink.active
                            : true,
                        link: item.title,
                      });
                      if (window.innerWidth < 768 && !iscontent) {
                        setTheme((prev) => {
                          return { ...prev, isSideBarSmall: true };
                        });
                      }
                    }}
                    className={`navItem group ${
                      theme.isSideBarSmall ? "relative " : ""
                    }${iscontent ? "dropDown" : ""} ${
                      activeLink.active && activeLink.link === item.title
                        ? "active"
                        : ""
                    }`}
                  >
                    <Link
                      className={`navLink flex  ${
                        theme.isSideBarSmall
                          ? "justify-center"
                          : "justify-between "
                      } items-center w-full`}
                      to={item.link}
                    >
                      <div className="flex gap-2 items-center">
                        <span className="icon">{item.icon}</span>
                        {!theme.isSideBarSmall && (
                          <span className="capitalize title">
                            {item.title?.split("-").join(" ")}
                          </span>
                        )}
                      </div>

                      {iscontent && !theme.isSideBarSmall ? (
                        <span className="arrow">
                          {
                            <MdKeyboardArrowRight
                              className={` ${
                                (activeLink.active &&
                                  activeLink.link === item.key) ||
                                item.title
                                  ? "rotate-90 fill-white "
                                  : ""
                              } fill-gray-400 dark:file:bg-gray-500  text-xl  `}
                            />
                          }
                        </span>
                      ) : (
                        ""
                      )}
                    </Link>
                    {iscontent ? (
                      <SideBarDropDown
                        isShow={
                          activeLink.active && activeLink.link === item.title
                        }
                        data={item.content}
                        activeSubLink={activeSubLink}
                        setActiveSubLink={setActiveSubLink}
                        parentTitle={item.title}
                      />
                    ) : (
                      ""
                    )}
                  </li>
                </Tippy>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default SideBar;
