import { useState } from "react";
import { VscEye } from "react-icons/vsc";
import { VscEyeClosed } from "react-icons/vsc";

function InputBox({
  label,
  id,
  type = "text",
  className,
  required = true,
  isRequired = true,
  onChange,
  name,
  value,
}) {
  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <input
        required={required}
        id={id}
        name={name}
        type={isShow ? "text" : type}
        className={`formControl  ${className} `}
        onChange={onChange}
        value={value}
      />
      <label htmlFor={id}>
        {label}
        {isRequired && <span className="text-red-600"> *</span>}
      </label>
      {type === "password" && (
        <div
          onClick={() => {
            setIsShow(!isShow);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
        >
          {isShow ? <VscEye /> : <VscEyeClosed />}
        </div>
      )}
    </>
  );
}

export default InputBox;
