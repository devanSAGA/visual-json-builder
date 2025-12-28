const variants = {
  success: 'bg-green-100 text-green-700',
  error: 'bg-red-100 text-red-700',
  warning: 'bg-yellow-100 text-yellow-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-700',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium rounded ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
