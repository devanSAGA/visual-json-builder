import { useState, useEffect, useCallback, useRef } from "react";
import { X, Pin, PinOff, Play } from "lucide-react";
import Editor from "@monaco-editor/react";
import useSchemaStore from "../../store/useSchemaStore";
import { generateJsonSchema } from "../../utils/schemaGenerator";
import { validateJson } from "../../utils/jsonValidator";
import useDebounce from "../../hooks/useDebounce";

export default function ValidatorPanel({ onClose, isPinned, onTogglePin }) {
  const { schema, jsonInput, setJsonInput, validationErrors, setValidationErrors } = useSchemaStore();
  const [localInput, setLocalInput] = useState(jsonInput || "{\n  \n}");
  const [parseError, setParseError] = useState(null);

  // Validate JSON against schema
  const runValidation = useCallback(
    (inputValue) => {
      // Try to parse the JSON
      let parsedJson;
      try {
        parsedJson = JSON.parse(inputValue);
        setParseError(null);
      } catch (e) {
        setParseError(`Invalid JSON: ${e.message}`);
        setValidationErrors([]);
        return;
      }

      // Generate JSON Schema from internal state
      const jsonSchema = generateJsonSchema(schema);

      // Validate
      const result = validateJson(jsonSchema, parsedJson);
      setValidationErrors(result.errors);
    },
    [schema, setValidationErrors]
  );

  const debouncedValidation = useDebounce(runValidation, 300);

  // Track previous schema to detect changes
  const schemaRef = useRef(schema);

  const handleEditorChange = (value) => {
    setLocalInput(value);
    setJsonInput(value);
    debouncedValidation(value);
  };

  // Re-validate when schema changes
  useEffect(() => {
    if (schemaRef.current !== schema && localInput) {
      schemaRef.current = schema;
      // Use setTimeout to avoid sync setState in effect
      setTimeout(() => runValidation(localInput), 0);
    }
  }, [schema, localInput, runValidation]);

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
          {parseError ? (
            <p className="text-sm text-red-600">{parseError}</p>
          ) : validationErrors.length === 0 ? (
            <p className="text-sm text-green-600">✓ Valid JSON</p>
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
