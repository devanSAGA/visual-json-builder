import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import ValidationErrorItem from "./ValidationErrorItem";

export default function ValidationErrorsList({
  parseError,
  errors,
  onGoToLine,
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const hasParseError = !!parseError;
  const errorCount = hasParseError ? 1 : errors.length;

  return (
    <div className="border-t border-red-200 flex-shrink-0 bg-red-50">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-red-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <AlertCircle size={14} className="text-red-500" />
          <h3 className="text-xs font-medium text-red-700 uppercase tracking-wide">
            {errorCount} {errorCount === 1 ? "Error" : "Errors"}
          </h3>
        </div>
        {isExpanded ? (
          <ChevronDown size={14} className="text-red-500" />
        ) : (
          <ChevronUp size={14} className="text-red-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 pb-3 max-h-32 overflow-auto">
          {parseError ? (
            <div className="flex items-start gap-2 text-sm text-red-700">
              <span className="text-red-400 mt-0.5">•</span>
              <span>{parseError}</span>
            </div>
          ) : (
            <ul className="space-y-1.5">
              {errors.map((error, index) => (
                <ValidationErrorItem
                  key={index}
                  error={error}
                  onGoToLine={onGoToLine}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
