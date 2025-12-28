import { useState } from "react";
import { X, Pin, PinOff, Play } from "lucide-react";
import Editor from "@monaco-editor/react";
import useSchemaStore from "../../store/useSchemaStore";

export default function ValidatorPanel({ onClose, isPinned, onTogglePin }) {
  const { jsonInput, setJsonInput, validationErrors } = useSchemaStore();
  const [localInput, setLocalInput] = useState(jsonInput || "{\n  \n}");

  const handleEditorChange = (value) => {
    setLocalInput(value);
    setJsonInput(value);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="h-10 pl-4 pr-2 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Play size={16} className="text-gray-500" />
          <h2 className="text-sm font-medium text-gray-700">Validator</h2>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onTogglePin}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title={isPinned ? "Unpin panel" : "Pin panel"}
          >
            {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Close panel"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Errors Section */}
      <div className="border-b border-gray-200">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Validation Errors
          </h3>
        </div>
        <div className="p-3 max-h-32 overflow-auto">
          {validationErrors.length === 0 ? (
            <p className="text-sm text-gray-500">No errors</p>
          ) : (
            <ul className="space-y-1">
              {validationErrors.map((error, index) => (
                <li
                  key={index}
                  className="text-sm text-red-600 flex items-start gap-2"
                >
                  <span className="text-red-400">•</span>
                  {error.message || error}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* JSON Input Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
          <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Input JSON
          </h3>
        </div>
        <div className="flex-1">
          <Editor
            height="100%"
            language="json"
            value={localInput}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>
    </div>
  );
}
