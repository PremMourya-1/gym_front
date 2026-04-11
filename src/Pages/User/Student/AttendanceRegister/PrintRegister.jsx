import { useSelector } from "react-redux";
import { COMMON_IMAGE_URL } from "../../../../Service/service";
// import { formatDate } from "react-datepicker/dist/date_utils";
import { useParams } from "react-router";
import formatDate from "../../../../Utils/formateDate";
import moment from "moment";
import { getLocaleStorageItem } from "../../../../Utils/localeStorage";
import { PRINT_ATTENDANCE_REGISTER } from "../../../../Constant/Constant";
import getRegisterData from "./registerService";
import { useEffect, useState } from "react";
import LoaderSpiner from "../../../../Components/Loaders/LoaderSpiner";
import NoRecords from "../../../../Components/NoRecords/NoRecords";

function PrintRegister() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);

  const { slug } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [registerData, setRegisterData] = useState();
  const schoolData = useSelector((state) => state.auth) || {};
  const month = formatDate(
    moment(`${slug.split("-")[3]}-${slug.split("-")[4]}`).format("YYYY-MM"),
  );
  const updatedMonth = `${month.split(" ")[1]} ${month.split(" ")[2]}`;

  function handleGetRegisterData() {
    getRegisterData(
      { sessionMasterId, ...getLocaleStorageItem(PRINT_ATTENDANCE_REGISTER) },
      setIsLoading,
      setRegisterData,
    );
  }

  useEffect(() => {
    handleGetRegisterData();
  }, []);

  return (
    <div
      id="attendancePrint"
      style={{ minHeight: "100vh", background: "white", color: "#272727" }}
      className=" p-4 "
    >
      <div className="container max-w-[1080px] m-auto ">
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

              <p className="mb-0 text-gray-800 font-medium  px-2">
                Attendance Register
              </p>
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
                <span>Class : </span>
                <span>A-B-c</span>
              </div>
              <div>
                <span>Month : </span>
                <span>{updatedMonth}</span>
              </div>
            </td>
          </tr>
          <br />
          <tr style={{ borderTop: "1px dashed gray", height: "20px " }}></tr>
        </table>

        {registerData ? (
          registerData.students?.length ? (
            <div className="tableParent min-w-[600px] overflow-x-auto CustomScrollBar ">
              <table className="w-full border dark:border-gray-500 border-r-gray-200  rounded-md overflow-hidden">
                <thead>
                  <tr className="border dark:border-gray-500 border-r-gray-200 bg-[color:var(--background)] text-white text-[12px]">
                    <td className="border darkOnPrint min-w-44 dark:border-gray-500 border-r-gray-200 px-2 py-1">
                      Student
                    </td>

                    {registerData?.dates?.map((item, i) => {
                      return (
                        <>
                          <td
                            className="border darkOnPrint min-w-[36px] dark:border-gray-500 border-r-gray-200 px-2 py-1"
                            key={i}
                          >
                            {item?.split("-")[2]}
                          </td>
                        </>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {registerData?.students?.map((item, i) => {
                    return (
                      <tr
                        key={i}
                        className="border  border-r-gray-200 even:bg-gray-50 text-[12px]"
                      >
                        <td className="border  capitalize  border-r-gray-200 px-2 py-1   ">
                          {item.name}
                        </td>

                        {item.attendance.map((item, i) => {
                          return (
                            <td
                              className="border  border-r-gray-200 px-2 py-1 text-[12px]"
                              key={i}
                            >
                              <span
                                className={` ${
                                  (item === "H" && "bg-blue-600") ||
                                  (item === "S" && "bg-yellow-600") ||
                                  (item === "P" && "bg-green-600") ||
                                  (item === "A" && "bg-red-600")
                                }  h-4 w-4 darkOnPrint text-[8px] text-white font-semibold rounded-full flex items-center justify-center`}
                              >
                                {item}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <NoRecords />
          )
        ) : (
          <LoaderSpiner color={true} />
        )}
      </div>
    </div>
  );
}

export default PrintRegister;
