interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
  value?: string; // ADICIONADO
  name?: string;  // ADICIONADO
  disabled?: boolean; // Disabled state
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  value = "",      // USADO COMO VALOR CONTROLADO
  name,            // USADO NO EVENTO
  disabled = false
}) => {
  // Manage the selected value

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <select
      name={name}
      value={value}
      onChange={handleChange}
      disabled={disabled}
      className={`h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className} ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
