import { useLocation } from "react-router";
import PrintHeader from "../../../../../Components/PrintHeader/PrintHeader";
import formatDate from "../../../../../Utils/formateDate";

function PrintBio() {
  const data = useLocation()?.state;
  return (
    <div>
      <div
        style={{ minHeight: "100vh", background: "white", color: "#272727" }}
        className=" p-4 "
      >
        <div className="container max-w-[1080px] m-auto ">
          <PrintHeader
            data={{ type: "", date: "" }}
            title="Biometric Attendance Report"
          />
          <table className=" text-left w-full">
            <thead>
              <tr className="">
                <th style={{ minWidth: "100px" }} className="text-sm">
                  Adm No
                </th>
                <th style={{ minWidth: "200px" }} className="text-sm">
                  Student Name
                </th>
                <th style={{ minWidth: "200px" }} className="text-sm">
                  {"Father's"} Name
                </th>

                {data &&
                  data[0]?.attendences?.map((item, i) => {
                    return (
                      <th
                        style={{ minWidth: "120px" }}
                        key={i + 1}
                        className="text-sm"
                      >
                        {formatDate(item.date)}
                      </th>
                    );
                  })}
              </tr>
            </thead>

            <tbody>
              {data?.map((item, i) => {
                return (
                  <tr key={i}>
                    <td className={`text-sm font-medium`}>
                      {item.admissionNo}
                    </td>
                    <td className={`text-sm font-medium`}>
                      {item.student_master.studentName}
                    </td>
                    <td className={`text-sm font-medium`}>
                      {item.student_master.fathersName}
                    </td>
                    {item.attendences?.map((attendance, j) => {
                      return (
                        <td className={`text-sm font-medium`} key={j}>
                          {(attendance.isPresent === 1 && "P") ||
                            (attendance.isPresent === 0 && "A")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default PrintBio;
