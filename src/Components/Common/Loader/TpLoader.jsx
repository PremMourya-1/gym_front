// import { PulseLoader } from "react-spinners";

function TpLoader() {
  return (
    <div className="bg-[#ffffff73] dark:bg-[#0000007e]  h-screen flex justify-center items-center z-[100] fixed w-full">
      {/* <PulseLoader color="#034f75" /> */}
      <div
        style={{ height: "30px", width: "30px" }}
        className={`spinerTp m-auto `}
      ></div>
    </div>
  );
}

export default TpLoader;
