import { useContext } from "react";
import Header from "../../Components/Common/Header/Header";
import { Outlet } from "react-router";
import SideBar from "../../Components/Common/SideBar/SideBar";
import Footer from "../../Components/Common/Footer/Footer";
import { ThemeContext } from "../../Context/ThemeContext";
// import BreadCrumb from "../../Components/Common/BreadCrumb/BreadCrumb";

function Layout() {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <SideBar />
      <Header />
      <main
        className={`${theme.isSideBarSmall ? "ms-20" : "ms-[260px] md:ms-14"
          } p-5 pb-10 overflow-y-scroll pt-[114px] md:ms-12 md:pt-[106px] md:pe-3 md:ps-5`}
      >
        {/* <BreadCrumb /> */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Layout;
