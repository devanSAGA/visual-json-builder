import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  Pin,
  PinOff,
  Play,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { Badge } from "../ui";
import useSchemaStore from "../../store/useSchemaStore";
import { generateJsonSchema } from "../../utils/schemaGenerator";
import { validateJson } from "../../utils/jsonValidator";
import useDebounce from "../../hooks/useDebounce";

export default function ValidatorPanel({ onClose, isPinned, onTogglePin }) {
  const { schema, jsonInput, setJsonInput, setValidationErrors } =
    useSchemaStore();
  const [localInput, setLocalInput] = useState(jsonInput || "{\n  \n}");
  const [parseError, setParseError] = useState(null);
  const [errors, setErrors] = useState([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [isErrorsExpanded, setIsErrorsExpanded] = useState(true);
  const [copied, setCopied] = useState(false);
  const editorRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(localInput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const goToLine = (lineNumber) => {
    if (editorRef.current && lineNumber) {
      editorRef.current.revealLineInCenter(lineNumber);
      editorRef.current.setPosition({ lineNumber, column: 1 });
      editorRef.current.focus();
    }
  };

  // Check if input is non-default (not empty or just whitespace/braces)
  const isNonDefaultInput = () => {
    try {
      const parsed = JSON.parse(localInput);
      return Object.keys(parsed).length > 0;
    } catch {
      return true; // Invalid JSON counts as non-default
    }
  };

  const hasParseError = !!parseError;
  const hasValidationErrors = errors.length > 0;
  const hasErrors = hasParseError || hasValidationErrors;
  const errorCount = hasParseError ? 1 : errors.length;

  // Only show badge if input is non-default AND (has errors OR validation has completed)
  const showBadge = isNonDefaultInput() && (hasErrors || hasValidated);

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
        setErrors([]);
        setValidationErrors([]);
        setHasValidated(true);
        return;
      }

      // Generate JSON Schema from internal state
      const jsonSchema = generateJsonSchema(schema);

      // Validate - pass the raw text to get line numbers
      const result = validateJson(jsonSchema, parsedJson, inputValue);
      setErrors(result.errors);
      setValidationErrors(result.errors);
      setHasValidated(true);
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

      {/* JSON Input Section */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              Input JSON
            </h3>
            {showBadge && (
              <Badge variant={hasErrors ? "error" : "success"}>
                {hasErrors ? "Invalid" : "Valid"}
              </Badge>
            )}
          </div>
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        </div>
        <div className="flex-1 min-h-0">
          <Editor
            height="100%"
            language="json"
            value={localInput}
            onChange={handleEditorChange}
            onMount={handleEditorMount}
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

      {/* Errors Section - only shown when there are errors */}
      {hasErrors && (
        <div className="border-t border-red-200 flex-shrink-0 bg-red-50">
          <button
            onClick={() => setIsErrorsExpanded(!isErrorsExpanded)}
            className="w-full px-4 py-2 flex items-center justify-between hover:bg-red-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <AlertCircle size={14} className="text-red-500" />
              <h3 className="text-xs font-medium text-red-700 uppercase tracking-wide">
                {errorCount} {errorCount === 1 ? "Error" : "Errors"}
              </h3>
            </div>
            {isErrorsExpanded ? (
              <ChevronDown size={14} className="text-red-500" />
            ) : (
              <ChevronUp size={14} className="text-red-500" />
            )}
          </button>
          {isErrorsExpanded && (
            <div className="px-4 pb-3 max-h-32 overflow-auto">
              {parseError ? (
                <div className="flex items-start gap-2 text-sm text-red-700">
                  <span className="text-red-400 mt-0.5">•</span>
                  <span>{parseError}</span>
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {errors.map((error, index) => (
                    <li
                      key={index}
                      onClick={() => error.line && goToLine(error.line)}
                      className={`text-sm text-red-700 flex items-center justify-between gap-2 ${
                        error.line ? "cursor-pointer hover:bg-red-100 rounded px-1 -mx-1" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">•</span>
                        <span>{error.message || error}</span>
                      </div>
                      {error.line && (
                        <span className="text-red-400 text-xs flex-shrink-0">
                          line {error.line}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
