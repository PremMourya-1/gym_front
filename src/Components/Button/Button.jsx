import { Link } from "react-router-dom";
import { FaPlus, FaFileExcel, FaPrint } from "react-icons/fa";

const VARIANTS = {
  primary: "bg-[var(--primary)] text-white hover:shadow-lg active:scale-[0.97]",

  danger: "bg-[var(--danger)] text-white  hover:shadow-lg active:scale-[0.97]",

  success:
    "bg-[var(--success)] text-white  hover:shadow-lg active:scale-[0.97]",

  info: "bg-[var(--info)] text-white  hover:shadow-lg active:scale-[0.97]",

  outline: "border text-[var(--text)] bg-transparent  hover:shadow-lg ",

  ghost: "bg-transparent text-[var(--text)]  hover:shadow-lg",

  link: "bg-transparent text-[var(--primary)] underline p-0 h-auto",
};

const SIZES = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-[13px]",
  lg: "h-11 px-6 text-[15px]",
  xl: "h-12 px-8 text-[16px]",
};

const ICONS = {
  add: <FaPlus size={14} />,
  excel: <FaFileExcel size={14} />,
  print: <FaPrint size={14} />,
};

const Button = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  className = "",
  children,
  onClick,
  disabled = false,
  type = "button",
  url,
}) => {
  const base =
    "inline-flex items-center gap-2 rounded-[5px] font-medium transition-all duration-200 focus:outline-none";

  const disabledStyle =
    "opacity-50 cursor-not-allowed hover:shadow-none active:scale-100";

  const content = (
    <>
      {icon && iconPosition === "left" && ICONS[icon]}
      {children}
      {icon && iconPosition === "right" && ICONS[icon]}
    </>
  );

  if (url) {
    return (
      <Link
        to={url}
        className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${
          disabled ? disabledStyle : ""
        } ${className}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${
        disabled ? disabledStyle : ""
      } ${className}`}
    >
      {content}
    </button>
  );
};

export default Button;
