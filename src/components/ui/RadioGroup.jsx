import { CheckCircle } from "lucide-react";

export default function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  className = "",
  variant = "default", // 'default' | 'compact'
}) {
  if (variant === "compact") {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <label
              key={option.value}
              className={`
                cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium
                transition-all
                ${
                  value === option.value
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={(e) => onChange(e.target.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="grid grid-cols-3 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex cursor-pointer rounded-lg border p-3
              focus:outline-none transition-all
              ${
                value === option.value
                  ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex flex-col">
              <span
                className={`
                text-sm font-medium
                ${value === option.value ? "text-blue-900" : "text-gray-900"}
              `}
              >
                {option.label}
              </span>
              {option.description && (
                <span
                  className={`
                  text-xs mt-0.5
                  ${value === option.value ? "text-blue-700" : "text-gray-500"}
                `}
                >
                  {option.description}
                </span>
              )}
            </div>
            {value === option.value && (
              <div className="absolute top-2 right-2 text-blue-600">
                <CheckCircle size={12} />
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
