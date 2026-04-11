import Button from "./Button";
import LoaderSpiner from "../Loaders/LoaderSpiner";

function AddUpdateButton({ isLoading, isEditing, className, disabled }) {
  return (
    <Button disabled={disabled} type="submit" className={`${className}`}>
      {isLoading ? (
        <div className="flex gap-1">
          <span>
            <LoaderSpiner />
          </span>
          Loading...
        </div>
      ) : isEditing ? (
        "Update"
      ) : (
        "Save"
      )}
    </Button>
  );
}

export default AddUpdateButton;
