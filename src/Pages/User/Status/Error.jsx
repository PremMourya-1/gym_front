import { MdNearbyError } from "react-icons/md";
import { Link } from "react-router-dom";
import { getLocaleStorageItem } from "../../../Utils/localeStorage";
import { ADMIN_DETAILS } from "../../../Constant/Constant";

function Error() {
  const isAdmin = getLocaleStorageItem(ADMIN_DETAILS);

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="text-center font-medium capitalize">
          <span>
            <MdNearbyError className="text-[120px] m-auto text-red-700" />
          </span>
          <p className="font-bold text-6xl mb-5">Oops !</p>
          <p className="text-lg  font-medium mt-3 ">
            <span className="font-bold text-3xl">404 -</span> The Page You are
            requested is not found
          </p>
          <Link
            to={isAdmin ? "/admin" : "/"}
            className="btn btn-primary m-auto mt-6 w-max"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </>
  );
}

export default Error;
