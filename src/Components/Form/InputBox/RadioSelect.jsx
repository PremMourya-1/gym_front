function RadioSelect({
  label,
  name,
  options = [],
  register,
  watch,
  required = false,
  labelClass,
}) {
  return (
    <fieldset
      className={`formControl border border-color rounded-md px-2 py-3 relative ${
        watch(name) ? "active" : ""
      }`}
    >
      <legend
        className={`px-2 w-max font-medium absolute text-[11px] -top-[8px] ${labelClass} bg-[var(--background)]`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </legend>

      <div className="flex items-center">
        {options.map((item, index) => (
          <div key={item.value || index + 1} className="flex items-center">
            {/* Option */}
            <label className="flex gap-2 text-xs items-center">
              <input
                type="radio"
                value={item.value}
                {...register(name)}
                required={required}
              />
              <span>{item.label}</span>
            </label>

            {/* Divider */}
            {index !== options.length - 1 && (
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-4" />
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export default RadioSelect;
