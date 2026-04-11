import { PulseLoader } from "react-spinners";

function PreLoader() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <PulseLoader color="#034f75" />
    </div>
  );
}

export default PreLoader;
