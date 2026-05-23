import { FaArrowLeft } from "react-icons/fa6";
import { MdChevronRight } from "react-icons/md";
import { Link } from "react-router-dom";
function BreadCrumb({ content, title }) {
  return (
    <div>
      <h2 className="text-xl flex gap-2 items-center font-semibold capitalize mb-1 text-[color:var(--primary)] ">
        <button
          onClick={() => {
            history.back();
          }}
        >
          <FaArrowLeft className="text-lg" />
        </button>
        {title}
      </h2>
      <div className="">
        <ul className="flex gap-2 items-center text-xs">
          {/* <button    onClick={() => {
            history.back();
          }}>
            <FaChevronLeft />
          </button> */}
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          {content?.map((item, i) => {
            return (
              <li key={i}>
                <Link
                  className={`${
                    item.slug === "#" ? "pointer-events-none" : ""
                  } capitalize flex gap-2 items-center `}
                  to={item.slug}
                >
                  <MdChevronRight />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default BreadCrumb;
