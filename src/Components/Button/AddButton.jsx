import { IoAdd } from "react-icons/io5";
import Button from "./Button";

function AddButton({ title, link, onclick, type, editClass, disabled }) {
  return (
    <>
      {" "}
      {link ? (
        <Button
          type="link"
          disabled={disabled}
          url={link}
          className={`max-lg:w-full flex items-center gap-1 w-full justify-center ${editClass}  !no-underline`}
        >
          <IoAdd size={18} />
          {title || "Add New"}
        </Button>
      ) : (
        <Button
          onClick={onclick}
          type={type}
          disabled={disabled}
          className={`max-lg:w-full flex items-center gap-1 ${
            editClass ? editClass : "w-full"
          }  justify-cente`}
        >
          <IoAdd size={16} />
          {title || "Add New"}
        </Button>
      )}
    </>
  );
}

export default AddButton;
