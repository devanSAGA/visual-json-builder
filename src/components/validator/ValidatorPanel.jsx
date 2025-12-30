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
const HIGHLIGHT_DURATION_MS = 1000;
const VALIDATION_DEBOUNCE_MS = 300;

export default function ValidatorPanel({ onClose }) {
  const {
    schema,
    jsonInput,
    setJsonInput,
    validationErrors,
    setValidationErrors,
  } = useSchemaStore();

  const [localInput, setLocalInput] = useState(jsonInput || DEFAULT_INPUT_JSON);
  const [parseError, setParseError] = useState(null);
  const [hasValidated, setHasValidated] = useState(false);
  const editorRef = useRef(null);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;
  };

  const decorationsRef = useRef([]);
  const highlightTimeoutRef = useRef(null);

  const goToLine = useCallback((lineNumber) => {
    if (editorRef.current && lineNumber) {
      const editor = editorRef.current;
      editor.revealLineInCenter(lineNumber);
      editor.setPosition({ lineNumber, column: 1 });
      editor.focus();

      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }

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

      highlightTimeoutRef.current = setTimeout(() => {
        decorationsRef.current = editor.deltaDecorations(
          decorationsRef.current,
          []
        );
      }, HIGHLIGHT_DURATION_MS);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const isNonDefaultInput = useMemo(() => {
    try {
      const parsed = JSON.parse(localInput);
      return Object.keys(parsed).length > 0;
    } catch {
      return true;
    }
  }, [localInput]);

  const hasParseError = !!parseError;
  const hasValidationErrors = validationErrors.length > 0;
  const hasErrors = hasParseError || hasValidationErrors;

  const showBadge = isNonDefaultInput && (hasErrors || hasValidated);

  const jsonSchema = useMemo(() => generateJsonSchema(schema), [schema]);

  const runValidation = useCallback(
    (inputValue) => {
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

      const result = validateJson(jsonSchema, parsedJson, inputValue);
      setValidationErrors(result.errors);
      setHasValidated(true);
    },
    [jsonSchema, setValidationErrors]
  );

  const debouncedValidation = useDebounce(runValidation, VALIDATION_DEBOUNCE_MS);

  const handleEditorChange = (value) => {
    setLocalInput(value);
    setJsonInput(value);
    debouncedValidation(value);
  };

  useEffect(() => {
    if (localInput) {
      runValidation(localInput);
    }
    // Re-validate when schema changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonSchema]);

  return (
    <div className="h-full flex flex-col bg-white">
      <ValidatorHeader onClose={onClose} />

      <JsonInputEditor
        value={localInput}
        onChange={handleEditorChange}
        onEditorMount={handleEditorMount}
        showBadge={showBadge}
        hasErrors={hasErrors}
        jsonSchema={jsonSchema}
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
          <span className="text-sm text-green-800 font-medium">Valid JSON</span>
        </div>
      )}
    </div>
  );
}
