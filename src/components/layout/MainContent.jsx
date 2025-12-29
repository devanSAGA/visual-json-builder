import { useState } from "react";
import { SchemaEditorPane } from "../schema-editor";
import { ValidatorPanel } from "../validator";
import { Button } from "../ui";
import { FlaskConical } from "lucide-react";

const VALIDATOR_PANE_WIDTH = 600;

function MainContent() {
  const [isValidatorOpen, setIsValidatorOpen] = useState(true);

  return (
    <div className="h-full flex gap-4">
      {/* Container 1: Schema Editor (Both Visual and Code Editor)*/}
      <div
        className="h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 relative"
        style={{
          width: isValidatorOpen
            ? `calc(100% - ${VALIDATOR_PANE_WIDTH}px - 16px)`
            : "100%",
        }}
      >
        <SchemaEditorPane />
        {!isValidatorOpen && (
          <div className="absolute bottom-4 right-4">
            <Button
              onClick={() => setIsValidatorOpen(true)}
              className="shadow-lg"
              variant="outline"
            >
              <FlaskConical size={16} className="mr-2" />
              Validate JSON
            </Button>
          </div>
        )}
      </div>

      {/* Container 2: Validator Panel */}
      {isValidatorOpen && (
        <div
          className="h-full flex-shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
          style={{ width: `${VALIDATOR_PANE_WIDTH}px` }}
        >
          <ValidatorPanel onClose={() => setIsValidatorOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default MainContent;
