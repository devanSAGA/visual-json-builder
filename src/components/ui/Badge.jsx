const variants = {
  success: "bg-green-50 text-green-700 border-green-200",
  error: "bg-red-50 text-red-700 border-red-200",
  warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  neutral: "bg-gray-50 text-gray-700 border-gray-200",
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center py-1 px-1.5 text-xs font-mono rounded-lg border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
