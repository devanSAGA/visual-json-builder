export const PROPERTY_TYPES_OPTIONS = [
  { value: "text", label: "Text", description: "String values" },
  { value: "number", label: "Number", description: "Numeric values" },
  { value: "boolean", label: "Boolean", description: "True or false" },
  { value: "object", label: "Object", description: "Nested properties" },
  { value: "array", label: "Array", description: "List of items" },
  { value: "null", label: "Null", description: "Null value only" },
];

export const ARRAYITEM_TYPES_OPTIONS = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "object", label: "Object" },
  { value: "null", label: "Null" },
];

export const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: "on",
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  largeFileOptimizations: true,
  folding: true,
};
