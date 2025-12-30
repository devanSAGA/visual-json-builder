import { useEffect, useRef } from "react";
import { Copy, Check, Paintbrush } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Badge, Button } from "../ui";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import { prettifyJson } from "../../utils/jsonFormatter";

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 13,
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  largeFileOptimizations: true,
  folding: true,
  quickSuggestions: true,
  suggestOnTriggerCharacters: true,
};

export default function JsonInputEditor({
  value,
  onChange,
  onEditorMount,
  showBadge,
  hasErrors,
  jsonSchema,
}) {
  const monacoRef = useRef(null);
  const { copied, copy } = useCopyToClipboard();

  const handlePrettify = () => {
    const { success, result } = prettifyJson(value);
    if (success) {
      onChange(result);
    }
  };

  // Configure JSON schema for autocompletion
  useEffect(() => {
    if (monacoRef.current && jsonSchema) {
      const monaco = monacoRef.current;
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: false, // We handle validation ourselves
        schemas: [
          {
            uri: "http://json-schema-builder/schema.json",
            fileMatch: ["*"],
            schema: jsonSchema,
          },
        ],
      });
    }
  }, [jsonSchema]);

  const handleEditorMount = (editor, monaco) => {
    monacoRef.current = monaco;
    if (jsonSchema) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: false,
        schemas: [
          {
            uri: "http://json-schema-builder/schema.json",
            fileMatch: ["*"],
            schema: jsonSchema,
          },
        ],
      });
    }
    onEditorMount?.(editor);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
      <div className="pl-4 pr-2 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
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
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrettify}
            title="Prettify JSON"
          >
            <Paintbrush size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => copy(value)}
            title="Copy to clipboard"
          >
            {copied ? (
              <Check size={16} className="text-green-500" />
            ) : (
              <Copy size={16} />
            )}
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="json"
          value={value}
          onChange={onChange}
          onMount={handleEditorMount}
          options={EDITOR_OPTIONS}
        />
      </div>
    </div>
  );
}
