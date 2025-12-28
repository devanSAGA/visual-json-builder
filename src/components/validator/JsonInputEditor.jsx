import { Copy, Check } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Badge, Button } from "../ui";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 13,
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
};

export default function JsonInputEditor({
  value,
  onChange,
  onEditorMount,
  showBadge,
  hasErrors,
}) {
  const { copied, copy } = useCopyToClipboard();

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
        <Button
          variant="ghost"
          size="icon"
          onClick={() => copy(value)}
          title="Copy to clipboard"
        >
          {copied ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Copy size={14} />
          )}
        </Button>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="json"
          value={value}
          onChange={onChange}
          onMount={onEditorMount}
          options={EDITOR_OPTIONS}
        />
      </div>
    </div>
  );
}
