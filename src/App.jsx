import { useState, useRef, useEffect } from "react";
import AppLayout from "./components/layout/AppLayout";
import { SchemaEditorPane } from "./components/schema-editor";
import { ValidatorPanel } from "./components/validator";
import { Button } from "./components/ui";
import { FlaskConical } from "lucide-react";

function App() {
  const [isValidatorOpen, setIsValidatorOpen] = useState(true);
  const [isValidatorPinned, setIsValidatorPinned] = useState(true);
  const validatorRef = useRef(null);

  // Close validator when clicking outside (only if not pinned)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isValidatorOpen &&
        !isValidatorPinned &&
        validatorRef.current &&
        !validatorRef.current.contains(event.target)
      ) {
        setIsValidatorOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isValidatorOpen, isValidatorPinned]);

  return (
    <AppLayout>
      <div className="h-full flex gap-4">
        {/* Container 1: Schema Editor */}
        <div
          className="h-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 relative"
          style={{
            width: isValidatorOpen ? "calc(100% - 400px - 16px)" : "100%",
          }}
        >
          <SchemaEditorPane />

          {/* Show Validator Button */}
          {!isValidatorOpen && (
            <div className="absolute bottom-4 right-4">
              <Button
                onClick={() => setIsValidatorOpen(true)}
                className="shadow-lg"
                variant="outline"
              >
                <FlaskConical size={16} className="mr-2" />
                Show Validator
              </Button>
            </div>
          )}
        </div>

        {/* Container 2: Validator Panel */}
        {isValidatorOpen && (
          <div
            ref={validatorRef}
            className="h-full flex-shrink-0 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200"
            style={{ width: "500px" }}
          >
            <ValidatorPanel
              onClose={() => setIsValidatorOpen(false)}
              isPinned={isValidatorPinned}
              onTogglePin={() => setIsValidatorPinned(!isValidatorPinned)}
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}

export default App;
