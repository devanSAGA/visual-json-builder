import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button, Badge, Select, InlineInput } from "../ui";

const typeOptions = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "null", label: "Null" },
];

export default function PropertyRow({
  property,
  onUpdate,
  onDelete,
  onEditFull,
}) {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);

  const startEditing = (field) => {
    setEditingField(field);
    setEditValue(property[field] || "");
  };

  const saveEdit = () => {
    if (editingField === "name" && !editValue.trim()) {
      setEditingField(null);
      return;
    }
    onUpdate(property.id, { [editingField]: editValue });
    setEditingField(null);
  };

  const cancelEdit = () => {
    setEditingField(null);
  };

  const handleTypeChange = (newType) => {
    onUpdate(property.id, { type: newType });
  };

  return (
    <div className="group flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Name - inline editable */}
        {editingField === "name" ? (
          <InlineInput
            value={editValue}
            onChange={setEditValue}
            onSave={saveEdit}
            onCancel={cancelEdit}
            className="font-medium text-gray-900 max-w-[150px]"
          />
        ) : (
          <span
            onClick={() => startEditing("name")}
            className="font-medium text-gray-900 px-1 py-0.5 rounded cursor-pointer truncate max-w-[150px] border border-transparent hover:border-gray-300 transition-colors"
            title={property.name}
          >
            {property.name}
          </span>
        )}

        {/* Description - show only if provided */}
        {property.description && (
          <span
            className="text-sm text-gray-500 truncate max-w-[200px]"
            title={property.description}
          >
            {property.description}
          </span>
        )}

        {/* Type - dropdown */}
        <Select
          value={property.type}
          options={typeOptions}
          onChange={handleTypeChange}
          isOpen={isTypeDropdownOpen}
          onToggle={setIsTypeDropdownOpen}
        />

        {/* Required badge */}
        {property.required && (
          <Badge variant="error" className="flex-shrink-0">
            Required
          </Badge>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
        <Button
          variant="ghost-primary"
          size="icon"
          onClick={() => onEditFull(property)}
          title="Edit all fields"
        >
          <Pencil size={16} />
        </Button>
        <Button
          variant="ghost-danger"
          size="icon"
          onClick={() => onDelete(property.id)}
          title="Delete property"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
