import { useSelector } from "react-redux";
import { COMMON_IMAGE_URL } from "../../Service/service";
import formatDate from "../../Utils/formateDate";

function PrintHeader({ data, title }) {
  const schoolData = useSelector((state) => state.auth) || {};

  return (
    <>
      <table className="w-full">
        <tr>
          {/* <td
            className="text-end"
            style={{
              fontWeight: "600",
              width: "200px",
              fontSize: "10px",
            }}
            colSpan={5}
          >
            <span>Reg No : </span>
            <span>{schoolData.regNo}</span>
          </td> */}
        </tr>
        <tr style={{}}>
          <td colSpan={1}>
            <img
              width={"80px"}
              src={COMMON_IMAGE_URL + schoolData.user.logo}
              alt="school logo"
            />
          </td>
          <td colSpan={4} className="text-center">
            <span
              style={{ fontWeight: "600", fontSize: "24px" }}
              className="schoolName capitalize"
            >
              {schoolData.user.schoolName}
            </span>
            <p className="mb-0 text-gray-800 font-medium px-2">
              {schoolData.address} {schoolData.district} {schoolData.state}
            </p>
            <p className="mb-0 text-gray-800 font-medium px-2">
              Ph : {schoolData.user?.mobileNo}
            </p>
            <p className="mb-0 text-gray-800 font-medium px-2">
              Email : {schoolData.user?.email}
            </p>
            {title && (
              <p className="mb-0 text-gray-800 font-medium  px-2">{title}</p>
            )}
          </td>
          <td
            style={{ width: "max-content" }}
            className="w-full text-end text-sm capitalize font-semibold"
          >
            <div>
              <span>SESSION : </span>
              <span>{schoolData.sessionData.sessionName}</span>
            </div>
            <div>
              <span>{data?.type?.split("-")[0]} Wise</span>
            </div>
            <div>
              <span>
                {data?.type?.split("-")[0] === "day"
                  ? "date"
                  : data?.type?.split("-")[0]}{" "}
                :{" "}
              </span>
              <span>
                {data.type === "year-report" &&
                  schoolData.sessionData.sessionName}
                {data.type === "day-report" && formatDate(data?.date)}
                {data.type === "month-report" &&
                  formatDate(data?.date)
                    ?.split(" ")
                    .filter((it, i) => i !== 0)
                    ?.join(" ")}
              </span>
            </div>
          </td>
        </tr>
        <br />
        <tr style={{ borderTop: "1px dashed gray", height: "20px " }}></tr>
      </table>
    </>
  );
}

export default PrintHeader;
