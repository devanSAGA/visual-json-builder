export default function ValidationErrorItem({ error, onGoToLine }) {
  const hasLine = !!error.line;

  return (
    <li
      onClick={() => hasLine && onGoToLine(error.line)}
      className={`text-sm text-red-700 flex items-center justify-between gap-2 ${
        hasLine ? "cursor-pointer hover:bg-red-100 rounded px-1 -mx-1" : ""
      }`}
    >
      <div className="flex items-start gap-2">
        <span className="text-red-400 mt-0.5">•</span>
        <span>{error.message || error}</span>
      </div>
      {hasLine && (
        <span className="text-red-400 text-xs flex-shrink-0">
          line {error.line}
        </span>
      )}
    </li>
  );
}
