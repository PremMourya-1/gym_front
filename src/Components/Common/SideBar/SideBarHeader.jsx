import logoSmall from "../../../Assets/images/logo/gymfox.png";
import logo from "../../../Assets/images/logo/gymfoxshort.png";
import { Link } from "react-router-dom";

function SideBarHeader({ isSideBarSmall }) {
  return (
    <>
      <div
        id="sideBarHeader"
        className={`py-4 sticky top-0 ${
          isSideBarSmall ? "h-[70px]" : "h-[90px]"
        } px-2.5   flex justify-center items-center`}
      >
        <Link to={"/"} className="logo">
          <span className="text-[color:var(--primary)]  ">
            {isSideBarSmall ? (
              <img className="w-40 m-auto" src={logoSmall} alt="logo" />
            ) : (
              ""
            )}
          </span>

          {!isSideBarSmall && (
            <img className="w-48 m-auto" src={logo} alt="logo" />
          )}
        </Link>
      </div>
    </>
  );
}

export default SideBarHeader;
