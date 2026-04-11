const Card = ({
  color = "white", // "white" | "light"
  isBorder = false,
  shadow = false,
  padding = true,
  rounded = true,
  className = "",
  children,
}) => {
  // Background classes based on color prop
  const bgClass =
    color === "light"
      ? "bg-[var(--background-light)]"
      : "bg-[var(--background)]";

  // Border classes
  const borderClass = isBorder ? "border border-[var(--border)]" : "";

  // Shadow classes
  const shadowClass = shadow ? "shadow-md" : "";

  // Padding classes
  const paddingClass = padding ? "p-3" : "";
  const roundedClass = rounded ? "rounded-[8px]" : "";

  return (
    <div
      className={
        "card " +
        roundedClass +
        " " +
        bgClass +
        " " +
        borderClass +
        " " +
        shadowClass +
        " " +
        paddingClass +
        " " +
        className
      }
    >
      {children}
    </div>
  );
};

export default Card;
