import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import useClickOutside from "../../hooks/useClickOutside";

export default function Select({
  value,
  options,
  onChange,
  isOpen,
  onToggle,
  className = "",
}) {
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => onToggle(false), isOpen);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => onToggle(!isOpen)}
        className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
      >
        {selectedOption?.label || value}
        <ChevronDown size={12} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                onToggle(false);
              }}
              className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                value === option.value
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
