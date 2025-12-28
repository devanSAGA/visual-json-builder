export default function Checkbox({
  label,
  id,
  checked,
  onChange,
  className = '',
  ...props
}) {
  return (
    <div className={`flex items-center ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="
          h-4 w-4
          rounded border-gray-300
          accent-blue-600
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          cursor-pointer
        "
        {...props}
      />
      {label && (
        <label htmlFor={id} className="ml-2 text-sm text-gray-700 cursor-pointer select-none">
          {label}
        </label>
      )}
    </div>
  )
}
