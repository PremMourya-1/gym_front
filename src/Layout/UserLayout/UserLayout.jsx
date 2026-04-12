import { useContext } from "react";
import Header from "../../Components/Common/Header/Header";
import { Outlet } from "react-router";
import SideBar from "../../Components/Common/SideBar/SideBar";
import Footer from "../../Components/Common/Footer/Footer";
import { ThemeContext } from "../../Context/ThemeContext";
// import BreadCrumb from "../../Components/Common/BreadCrumb/BreadCrumb";

function Layout() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <>
      <SideBar />
      <Header />
      <main
        onClick={() => {
          if (window.innerWidth < 768) {
            setTheme((prev) => {
              return { ...prev, isSideBarSmall: true };
            });
          }
        }}
        className={`${
          theme.isSideBarSmall ? "md:ms-0 ms-20" : "ms-[260px] md:ms-0"
        } p-5 overflow-y-scroll pt-[114px] md:ms-12 md:pt-[86px] md:p-3 min-h-screen !pb-20`}
      >
        {/* <BreadCrumb /> */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
