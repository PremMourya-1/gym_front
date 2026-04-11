import PreLoader from "../../../../../Components/Common/Loader/PreLoader";
import NoRecords from "../../../../../Components/Common/NoRecords/NoRecords";
import formatDate from "../../../../../Utils/formateDate";

function BioTable({ data }) {
  return (
    <div className="card">
      <div className="overflow-x-auto CustomScrollBar rounded-lg ">
        <table className="customTable  min-w-[600px] text-left w-full">
          <thead>
            <tr className="">
              <th style={{ minWidth: "100px" }} className="text-sm">
                Adm No
              </th>
              <th style={{ minWidth: "100px" }} className="text-sm">
                Device Id
              </th>
              <th style={{ minWidth: "200px" }} className="text-sm">
                Student Name
              </th>
              <th style={{ minWidth: "200px" }} className="text-sm">
                {"Father's"} Name
              </th>

              {data &&
                data[0]?.attendance?.map((item, i) => {
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
                    {item.student_master.admissionNo}
                  </td>
                  <td className={`text-sm font-medium`}>
                    {item.student_master.deviceId}
                  </td>
                  <td className={`text-sm font-medium`}>
                    {item.student_master.studentName}
                  </td>
                  <td className={`text-sm font-medium`}>
                    {item.student_master.fathersName}
                  </td>
                  {item.attendance?.map((attendance, j) => {
                    return (
                      <td className={`text-sm font-medium`} key={j}>
                        <span
                          className={` ${
                            (attendance.isPresent === "A" && "bg-red-600") ||
                            (attendance.isPresent === "P" && "bg-green-600")
                          }  h-6 w-6 text-[10px] text-white font-semibold rounded-full flex items-center justify-center`}
                        >
                          {attendance.isPresent}
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
      {data ? (
        data.length ? (
          ""
        ) : (
          <div className="pt-3">
            <NoRecords />
          </div>
        )
      ) : (
        <PreLoader />
      )}
      {/* <Table columns={classColumns} data={data} /> */}
    </div>
  );
}

export default BioTable;
