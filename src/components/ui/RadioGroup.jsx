export default function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  className = '',
}) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex cursor-pointer rounded-lg border p-4
              focus:outline-none transition-all
              ${value === option.value
                ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-600'
                : 'border-gray-200 bg-white hover:border-gray-300'
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
              <span className={`
                text-sm font-medium
                ${value === option.value ? 'text-blue-900' : 'text-gray-900'}
              `}>
                {option.label}
              </span>
              {option.description && (
                <span className={`
                  text-xs mt-0.5
                  ${value === option.value ? 'text-blue-700' : 'text-gray-500'}
                `}>
                  {option.description}
                </span>
              )}
            </div>
            {value === option.value && (
              <div className="absolute top-2 right-2 text-blue-600">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
        ))}
      </div>
    </div>
  )
}
