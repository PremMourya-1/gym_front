import { useContext } from "react";
import { ThemeContext } from "../../../Context/ThemeContext";

function Footer() {
  const { theme } = useContext(ThemeContext);

  return (
    <footer
      className={`${theme.isSideBarSmall ? "ms-20 small px-5 md:ms-12 md:bottom-3" : "ms-[260px] px-5 pt-3  md:ms-14"}`}
    >
      <div className="footerDetails flex items-center justify-between ">
        <p className="text-sm">Super Gymora</p>
        <span className="text-sm">Version 1.0</span>
      </div>
    </footer>
  );
}

export default Footer;
