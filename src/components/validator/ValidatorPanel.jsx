import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { CheckCircle } from "lucide-react";
import useSchemaStore from "../../store/useSchemaStore";
import { generateJsonSchema } from "../../utils/schemaGenerator";
import { validateJson } from "../../utils/jsonValidator";
import useDebounce from "../../hooks/useDebounce";
import ValidatorHeader from "./ValidatorHeader";
import JsonInputEditor from "./JsonInputEditor";
import ValidationErrorsList from "./ValidationErrorsList";

const DEFAULT_INPUT_JSON = "{\n  \n}";

export default function ValidatorPanel({ onClose, isPinned, onTogglePin }) {
  const { schema, jsonInput, setJsonInput, validationErrors, setValidationErrors } =
    useSchemaStore();

  const [localInput, setLocalInput] = useState(jsonInput || DEFAULT_INPUT_JSON);
  const [parseError, setParseError] = useState(null);
  const [hasValidated, setHasValidated] = useState(false);
  const editorRef = useRef(null);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const decorationsRef = useRef([]);

  const goToLine = (lineNumber) => {
    if (editorRef.current && lineNumber) {
      const editor = editorRef.current;
      editor.revealLineInCenter(lineNumber);
      editor.setPosition({ lineNumber, column: 1 });
      editor.focus();

      // Add temporary highlight decoration
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [
        {
          range: {
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: 1,
          },
          options: {
            isWholeLine: true,
            className: "error-line-highlight",
          },
        },
      ]);

      // Remove highlight after 1 second
      setTimeout(() => {
        decorationsRef.current = editor.deltaDecorations(
          decorationsRef.current,
          []
        );
      }, 1000);
    }
  };

  // Check if input is non-default (not empty or just whitespace/braces)
  const isNonDefaultInput = useMemo(() => {
    try {
      const parsed = JSON.parse(localInput);
      return Object.keys(parsed).length > 0;
    } catch {
      return true; // Invalid JSON counts as non-default
    }
  }, [localInput]);

  const hasParseError = !!parseError;
  const hasValidationErrors = validationErrors.length > 0;
  const hasErrors = hasParseError || hasValidationErrors;

  // Only show badge if input is non-default and has errors
  const showBadge = isNonDefaultInput && (hasErrors || hasValidated);

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
        setHasValidated(true);
        return;
      }

      // Generate JSON Schema from internal state
      const jsonSchema = generateJsonSchema(schema);

      // Validate - pass the raw text to get line numbers
      const result = validateJson(jsonSchema, parsedJson, inputValue);
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
      <ValidatorHeader
        onClose={onClose}
        isPinned={isPinned}
        onTogglePin={onTogglePin}
      />

      <JsonInputEditor
        value={localInput}
        onChange={handleEditorChange}
        onEditorMount={handleEditorMount}
        showBadge={showBadge}
        hasErrors={hasErrors}
      />

      {hasErrors && (
        <ValidationErrorsList
          parseError={parseError}
          errors={validationErrors}
          onGoToLine={goToLine}
        />
      )}

      {!hasErrors && hasValidated && isNonDefaultInput && (
        <div className="mx-4 mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
          <span className="text-sm text-green-800 font-medium">
            Valid JSON — no errors found
          </span>
        </div>
      )}
    </div>
  );
}
