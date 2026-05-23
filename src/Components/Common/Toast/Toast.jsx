import toast from "react-hot-toast";

function makeToast(message, type = "success") {
  switch (type) {
    case "success":
      toast.success(message);
      break;
    case "error":
      toast.error(message);
      break;

    default:
      toast(message);
      break;
  }
}

export { makeToast };
