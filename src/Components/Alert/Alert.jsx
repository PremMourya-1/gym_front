import { IoClose } from "react-icons/io5";
function Alert({ message, onclose }) {
  return (
    <div className=" alertMessage mb-5 text-center">
      {/* <p className="text-2xl font-semibold">Alert</p> */}

      <p className="text-red-600 font-medium dark:text-gray-200">! {message}</p>
      <button>{}</button>
      <button onClick={onclose} className=" closeAlert">
        <IoClose />
      </button>
    </div>
  );
}

export default Alert;
