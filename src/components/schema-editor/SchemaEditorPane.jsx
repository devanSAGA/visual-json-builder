import { useRef } from "react";
import {
  Copy,
  Download,
  Check,
  Wand2,
  SquareChevronRight,
  Braces,
} from "lucide-react";
import { ResizablePanes, Button } from "../ui";
import VisualBuilder from "./VisualBuilder";
import SchemaCodeEditor from "./SchemaCodeEditor";
import useSchemaStore from "../../store/useSchemaStore";
import { generateJsonSchema } from "../../utils/schemaGenerator";
import useCopyToClipboard from "../../hooks/useCopyToClipboard";

function PaneHeader({ icon, title, actions }) {
  return (
    <div className="h-10 pl-4 pr-2 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
      </div>
      {actions && <div className="flex items-center gap-1">{actions}</div>}
    </div>
  );
}

export default function SchemaEditorPane() {
  const { schema } = useSchemaStore();
  const editorRef = useRef(null);
  const { copied, copy } = useCopyToClipboard();

  const getSchemaJson = () => {
    const jsonSchema = generateJsonSchema(schema);
    return JSON.stringify(jsonSchema, null, 2);
  };

  const handleDownload = () => {
    const schemaJson = getSchemaJson();
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
        <Wand2 size={16} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => copy(getSchemaJson())}
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
    <div className="h-full flex flex-col bg-white">
      <PaneHeader
        icon={<SquareChevronRight size={16} className="text-gray-500" />}
        title="Visual Editor"
      />
      <div className="flex-1 overflow-auto">
        <VisualBuilder />
      </div>
    </div>
  );

  const rightPane = (
    <div className="h-full flex flex-col bg-white">
      <PaneHeader
        icon={<Braces size={16} className="text-gray-500" />}
        title="JSON Schema"
        actions={schemaActions}
      />
      <div className="flex-1 overflow-hidden">
        <SchemaCodeEditor ref={editorRef} />
      </div>
    </div>
  );

  return (
    <ResizablePanes
      leftPane={leftPane}
      rightPane={rightPane}
      defaultLeftWidth={50}
      minLeftWidth={25}
      maxLeftWidth={75}
    />
  );
}
