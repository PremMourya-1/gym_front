import { BsQuestionDiamond } from "react-icons/bs";

function ConfirmModal({ message }) {
  return (
    <>
      <div className="text-center p-4 pb-0">
        <p className=" text-red-600   dark:text-red-600 mb-5  ">
          <BsQuestionDiamond className="m-auto block text-5xl" />
        </p>
        <h3 className=" text-2xl capitalize font-semibold">are You Sure ?</h3>
        <p>
          {message ||
            "once you delete you will never able to get back this data again"}
        </p>
      </div>
    </>
  );
}

export default ConfirmModal;
