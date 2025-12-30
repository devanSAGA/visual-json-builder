import { useRef, useMemo } from "react";
import {
  Copy,
  Download,
  Check,
  Paintbrush,
  SquareChevronRight,
  Braces,
} from "lucide-react";
import { ResizablePanes, Button } from "../ui";
import VisualBuilder from "./VisualBuilder";
import SchemaCodeEditor from "./SchemaCodeEditor";
import useSchemaStore from "../../store/useSchemaStore";
import { generateJsonSchema } from "../../utils/schemaGenerator";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";

// In % unit
const LEFT_PANE_DEFAULT_WIDTH = 50;
const LEFT_PANE_MIN_WIDTH = 25;
const LEFT_PANE_MAX_WIDTH = 75;

function EditorPane({ icon, title, actions, children, overflow = "auto" }) {
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="h-10 pl-4 pr-2 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-medium text-gray-700">{title}</h2>
        </div>
        {actions && <div className="flex items-center gap-1">{actions}</div>}
      </div>
      <div className={`flex-1 overflow-${overflow}`}>{children}</div>
    </div>
  );
}

export default function SchemaEditorPane() {
  const { schema } = useSchemaStore();
  const editorRef = useRef(null);
  const { copied, copy } = useCopyToClipboard();

  const schemaJson = useMemo(() => {
    const jsonSchema = generateJsonSchema(schema);
    return JSON.stringify(jsonSchema, null, 2);
  }, [schema]);

  const handleDownload = () => {
    const blob = new Blob([schemaJson], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = schema.title
      ? `${schema.title.toLowerCase().replace(/\s+/g, "-")}-schema.json`
      : "schema.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrettify = () => {
    editorRef.current?.prettify();
  };

  const schemaActions = (
    <>
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
        onClick={() => copy(schemaJson)}
        title="Copy to clipboard"
      >
        {copied ? (
          <Check size={16} className="text-green-500" />
        ) : (
          <Copy size={16} />
        )}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDownload}
        title="Download schema"
      >
        <Download size={16} />
      </Button>
    </>
  );

  const leftPane = (
    <EditorPane
      icon={<SquareChevronRight size={16} className="text-gray-500" />}
      title="Visual Editor"
    >
      <VisualBuilder />
    </EditorPane>
  );

  const rightPane = (
    <EditorPane
      icon={<Braces size={16} className="text-gray-500" />}
      title="JSON Schema"
      actions={schemaActions}
      overflow="hidden"
    >
      <SchemaCodeEditor ref={editorRef} />
    </EditorPane>
  );

  return (
    <ResizablePanes
      leftPane={leftPane}
      rightPane={rightPane}
      defaultLeftWidth={LEFT_PANE_DEFAULT_WIDTH}
      minLeftWidth={LEFT_PANE_MIN_WIDTH}
      maxLeftWidth={LEFT_PANE_MAX_WIDTH}
    />
  );
}
