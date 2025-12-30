import { useState } from "react";
import { Pencil, Trash2, ChevronRight, Plus } from "lucide-react";
import { Button, Badge, Select, InlineInput } from "../ui";

const typeOptions = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "object", label: "Object" },
  { value: "array", label: "Array" },
  { value: "null", label: "Null" },
];

const arrayItemTypeOptions = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "object", label: "Object" },
  { value: "null", label: "Null" },
];

export default function PropertyRow({
  property,
  onUpdate,
  onDelete,
  onEditFull,
  onAddNested,
  level = 0,
}) {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isItemTypeDropdownOpen, setIsItemTypeDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
    const oldType = property.type;
    const hasNestedData =
      (oldType === "object" && property.properties?.length > 0) ||
      (oldType === "array" && property.items?.objectProperties?.length > 0);

    if (hasNestedData && newType !== "object" && newType !== "array") {
      const confirmed = window.confirm(
        "Changing type will remove nested properties. Continue?"
      );
      if (!confirmed) return;
    }

    const updates = { type: newType };
    // Initialize nested structures for object/array types
    if (newType === "object" && !property.properties) {
      updates.properties = [];
    }
    if (newType === "array" && !property.items) {
      updates.items = { type: "text" };
    }
    // Clear nested data when changing away from object/array
    if (newType !== "object") {
      updates.properties = undefined;
    }
    if (newType !== "array") {
      updates.items = undefined;
    }

    onUpdate(property.id, updates);
  };

  const handleItemTypeChange = (newItemType) => {
    const oldItemType = property.items?.type;
    const hasNestedData =
      oldItemType === "object" && property.items?.objectProperties?.length > 0;

    if (hasNestedData && newItemType !== "object") {
      const confirmed = window.confirm(
        "Changing item type will remove nested properties. Continue?"
      );
      if (!confirmed) return;
    }

    const newItems = { type: newItemType };
    if (newItemType === "object") {
      newItems.objectProperties = property.items?.objectProperties || [];
    }

    onUpdate(property.id, { items: newItems });
  };

  // Check if this property can have children
  const canHaveChildren =
    property.type === "object" ||
    (property.type === "array" && property.items?.type === "object");

  // Get nested children based on type
  const getNestedChildren = () => {
    if (property.type === "object") {
      return property.properties || [];
    }
    if (property.type === "array" && property.items?.type === "object") {
      return property.items?.objectProperties || [];
    }
    return [];
  };

  const nestedChildren = getNestedChildren();

  return (
    <div style={{ marginLeft: level * 4 }}>
      <div className="group flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {/* Expand/collapse chevron for object/array types */}
          {canHaveChildren ? (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse" : "Expand"}
              className="flex-shrink-0"
            >
              <ChevronRight
                size={16}
                className={`text-gray-500 transition-transform ${
                  isExpanded ? "rotate-90" : ""
                }`}
              />
            </Button>
          ) : (
            <div className="w-7" /> // Spacer for alignment
          )}

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
          <div className="flex items-center gap-1">
            <Select
              value={property.type}
              options={typeOptions}
              onChange={handleTypeChange}
              isOpen={isTypeDropdownOpen}
              onToggle={setIsTypeDropdownOpen}
            />
            {property.type === "array" && (
              <>
                <span className="text-xs text-gray-400">of</span>
                <Select
                  value={property.items?.type || "text"}
                  options={arrayItemTypeOptions}
                  onChange={handleItemTypeChange}
                  isOpen={isItemTypeDropdownOpen}
                  onToggle={setIsItemTypeDropdownOpen}
                />
              </>
            )}
          </div>

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

      {/* Nested children */}
      {isExpanded && canHaveChildren && (
        <div className="ml-4 mt-2 pl-4 border-l-2 border-gray-200">
          {property.type === "array" && property.items?.type === "object" && (
            <div className="text-xs text-gray-500 mb-2 font-medium">
              Array item properties:
            </div>
          )}

          {nestedChildren.length === 0 ? (
            <div className="text-sm text-gray-400 italic mb-2">
              No nested properties yet
            </div>
          ) : (
            <div className="space-y-2">
              {nestedChildren.map((child) => (
                <PropertyRow
                  key={child.id}
                  property={child}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onEditFull={onEditFull}
                  onAddNested={onAddNested}
                  level={level + 1}
                />
              ))}
            </div>
          )}

          {/* Add nested property button */}
          {onAddNested && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onAddNested(property.id, property.type === "array")
              }
              className="mt-1 text-xs"
            >
              <Plus size={14} className="mr-1" />
              Add {property.type === "array" ? "Item Property" : "Property"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
