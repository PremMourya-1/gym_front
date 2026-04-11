import BreadCrumb from "../../../Components/Common/BreadCrumb/BreadCrumb";
import { useState } from "react";
import getLogfileData from "./logFileService";
import LoaderSpiner from "../../../Components/Loaders/LoaderSpiner";
import LogTable from "./LogTable";
import { useSelector } from "react-redux";

function LogFile() {
  const sessionMasterId = useSelector((state) => state.auth?.sessionData?.id);

  const [payload, setPayload] = useState({});
  const [logData, setLogData] = useState({ attendences: [] });
  const [isLoading, setIsLoading] = useState(false);
  console.log(logData);

  function handleGetLogData(e) {
    e.preventDefault();
    getLogfileData({ ...payload, sessionMasterId }, setIsLoading, setLogData);
  }
  return (
    <>
      <div className="card p-4 mb-3">
        <BreadCrumb />
      </div>

      <div className="card p-4 mb-4 ">
        <form
          onSubmit={handleGetLogData}
          className="flex items-center  sm:flex-wrap pt-4 gap-6"
        >
          <div className="inputBox w-[250px]">
            <input
              onChange={(e) => {
                setPayload((prev) => {
                  return {
                    ...prev,
                    studentName: e.target.value,
                  };
                });
              }}
              required
              type={"text"}
              className={`formControl`}
            />
            <label htmlFor={"id"}>
              Student Name <span className="text-red-600"> *</span>
            </label>
          </div>
          <div className="inputBox w-[250px]">
            <input
              onChange={(e) => {
                setPayload((prev) => {
                  return {
                    ...prev,
                    date: e.target.value,
                  };
                });
              }}
              required
              // value={moment(date).format("YYYY-MM-DD")}
              // max={moment(new Date()).format("YYYY-MM-DD")}
              type={"date"}
              className={`formControl`}
            />
            <label htmlFor={"id"}>
              Select Date <span className="text-red-600"> *</span>
            </label>
          </div>
          <button disabled={isLoading} className="btn  btn-primary ">
            {isLoading ? <LoaderSpiner /> : "Get"}
          </button>
        </form>
      </div>

      <LogTable data={logData?.attendences} />
    </>
  );
}

export default LogFile;
