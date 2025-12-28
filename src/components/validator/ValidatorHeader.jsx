import { X, Pin, PinOff, Play } from "lucide-react";
import { Button } from "../ui";

export default function ValidatorHeader({ onClose, isPinned, onTogglePin }) {
  return (
    <div className="h-10 pl-4 pr-2 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center gap-2">
        <Play size={16} className="text-gray-500" />
        <h2 className="text-sm font-medium text-gray-700">Validator</h2>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={onTogglePin}
          title={isPinned ? "Unpin panel" : "Pin panel"}
        >
          {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          title="Close panel"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}
