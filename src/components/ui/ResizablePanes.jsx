import { useState, useCallback, useEffect, useRef } from "react";

export default function ResizablePanes({
  leftPane,
  rightPane,
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
        className="h-full overflow-hidden"
        style={{ width: `${leftWidth}%` }}
      >
        {leftPane}
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
      <div className="h-full overflow-hidden flex-1">
        {rightPane}
      </div>
    </div>
  );
}
