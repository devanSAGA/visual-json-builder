import { useRef, useEffect } from "react";

export default function InlineInput({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder = "",
  className = "",
  autoFocus = true,
  autoSelect = true,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      if (autoSelect) {
        inputRef.current.select();
      }
    }
  }, [autoFocus, autoSelect]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSave();
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onSave}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`px-1 py-0.5 border border-blue-400 rounded outline-none bg-white ${className}`}
    />
  );
}
