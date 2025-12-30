export default function HelperMessage({ children, className = "" }) {
  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      {children}
    </div>
  );
}
