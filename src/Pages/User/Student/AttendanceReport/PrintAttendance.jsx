import { useLocation, useNavigate, useParams } from "react-router";
import PrintHeader from "../../../../Components/PrintHeader/PrintHeader";
import { useEffect, useState } from "react";
import { getLocaleStorageItem } from "../../../../Utils/localeStorage";
import { PRINT_ATTENDANCE_REPORT } from "../../../../Constant/Constant";
import getAttendanceReport from "./reportService";

function PrintAttendance() {
  const { slug } = useParams();
  const state = useLocation()?.state;
  const [data, setData] = useState();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!data) {
      const payload = getLocaleStorageItem(PRINT_ATTENDANCE_REPORT);
      if (payload) {
        getAttendanceReport(payload, setData);
        getAttendanceReport(payload, setData, setIsLoading);
      } else navigate("/not-found");
    } else {
      setData(state);
    }
  }, [slug]);

  useEffect(() => {
    data && window.print();
  }, [data]);

  return (
    <>
      <div
        id="attendancePrint"
        style={{ minHeight: "100vh", background: "white", color: "#272727" }}
        className=" p-4 "
      >
        <div className="container max-w-[1080px] m-auto ">
          <PrintHeader
            data={{ type: slug, date: data?.date }}
            title="Attendance Report"
          />

          {!isLoading ? (
            <>
              {slug === "day-report" && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border bg-gray-100">
                      <th className="border p-1.5">Sr No.</th>

                      <th className="border p-1.5">Student Name</th>
                      <th className="border p-1.5">{"Father's"} Name</th>
                      <th className="border p-1.5">Present</th>
                    </tr>
                  </thead>
                  {data?.studentData?.map((item, i) => {
                    return (
                      <tr className={`border odd:bg-gray-50`} key={i}>
                        <td className="border p-1">{i + 1}</td>
                        <td className="border p-1">{item.studentName}</td>
                        <td className="border p-1">{item.fathersName}</td>
                        <td className="border p-1">
                          {(item.isPresent === 1 && "Present") ||
                            (item.isPresent === 0 && "Absent")}
                        </td>
                      </tr>
                    );
                  })}
                </table>
              )}
              {(slug === "month-report" || slug === "year-report") && (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border bg-gray-100">
                      <th className="border p-1.5">Sr No.</th>

                      <th className="border p-1.5">Student Name</th>
                      <th className="border p-1.5">{"Father's"} Name</th>
                      <th className="border p-1.5">Total Days</th>
                      <th className="border p-1.5">Holiday</th>
                      <th className="border p-1.5">Present</th>
                      <th className="border p-1.5">Absent</th>
                    </tr>
                  </thead>
                  {data?.studentData?.map((item, i) => {
                    return (
                      <tr className={`border odd:bg-gray-50`} key={i}>
                        <td className="border p-1">{i + 1}</td>
                        <td className="border p-1">
                          {item.student?.studentName}
                        </td>
                        <td className="border p-1">
                          {item.student?.fathersName}
                        </td>
                        <td className="border p-1">{item.totalDay}</td>
                        <td className="border p-1">{item.holidays}</td>
                        <td className="border p-1">{item.totalPresent}</td>
                        <td className="border p-1">{item.totalAbsent}</td>
                      </tr>
                    );
                  })}
                </table>
              )}
            </>
          ) : (
            <p className="text-center p-4 font-semibold text-lg">Loading...</p>
          )}
        </div>
      </div>
    </>
  );
}

export default PrintAttendance;
