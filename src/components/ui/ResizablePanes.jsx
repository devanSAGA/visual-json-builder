import { useState, useCallback, useEffect, useRef } from "react";
import { SquareChevronRight, Braces } from "lucide-react";

export default function ResizablePanes({
  leftPane,
  rightPane,
  leftTitle,
  rightTitle,
  defaultLeftWidth = 50,
  minLeftWidth = 20,
  maxLeftWidth = 80,
}) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();
      const newLeftWidth =
        ((e.clientX - containerRect.left) / containerRect.width) * 100;

      if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
        setLeftWidth(newLeftWidth);
      }
    },
    [isDragging, minLeftWidth, maxLeftWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div ref={containerRef} className="h-full flex">
      {/* Left Pane */}
      <div
        className="bg-white overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        {leftTitle && (
          <div className="h-10 px-4 flex items-center gap-2 border-b border-gray-200">
            <SquareChevronRight size={16} className="text-gray-500" />
            <h2 className="text-sm font-medium text-gray-700">{leftTitle}</h2>
          </div>
        )}
        <div className={leftTitle ? "h-[calc(100%-2.5rem)]" : "h-full"}>
          {leftPane}
        </div>
      </div>

      {/* Resizer */}
      <div
        className={`
          w-0.5 cursor-col-resize flex-shrink-0
          bg-gray-200 hover:bg-blue-400 transition-colors
          ${isDragging ? "bg-blue-500" : ""}
        `}
        onMouseDown={handleMouseDown}
      />

      {/* Right Pane */}
      <div className="bg-white overflow-hidden flex-1">
        {rightTitle && (
          <div className="h-10 px-4 flex items-center gap-2 border-b border-gray-200">
            <Braces size={16} className="text-gray-500" />
            <h2 className="text-sm font-medium text-gray-700">{rightTitle}</h2>
          </div>
        )}
        <div className={rightTitle ? "h-[calc(100%-2.5rem)]" : "h-full"}>
          {rightPane}
        </div>
      </div>
    </div>
  );
}
