import { useState, useCallback } from "react";
import { Pencil, Trash2, ChevronRight, Plus } from "lucide-react";
import {
  Button,
  Badge,
  Select,
  InlineInput,
  HelperMessage,
  ConfirmDialog,
} from "../ui";
import { ARRAYITEM_TYPES_OPTIONS, PROPERTY_TYPES_OPTIONS } from "./constants";
import useInlineEdit from "../../hooks/useInlineEdit";

export default function PropertyRow({
  property,
  onUpdate,
  onDelete,
  onEditFull,
  onAddNested,
  level = 0,
}) {
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isItemTypeDropdownOpen, setIsItemTypeDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    message: "",
    onConfirm: null,
  });

  const handleSaveEdit = useCallback(
    (field, value) => {
      onUpdate(property.id, { [field]: value });
    },
    [onUpdate, property.id]
  );

  const validateEdit = useCallback((field, value) => {
    if (field === "name" && !value.trim()) {
      return false;
    }
    return true;
  }, []);

  const { editingField, editValue, setEditValue, startEditing, saveEdit, cancelEdit } =
    useInlineEdit({ onSave: handleSaveEdit, validate: validateEdit });

  const showConfirmDialog = useCallback((message, onConfirm) => {
    setConfirmDialog({ isOpen: true, message, onConfirm });
  }, []);

  const closeConfirmDialog = useCallback(() => {
    setConfirmDialog({ isOpen: false, message: "", onConfirm: null });
  }, []);

  const checkNestedDataLoss = useCallback(
    (oldType, newType, isArrayItem = false) => {
      if (isArrayItem) {
        return (
          oldType === "object" &&
          property.items?.objectProperties?.length > 0 &&
          newType !== "object"
        );
      }
      return (
        ((oldType === "object" && property.properties?.length > 0) ||
          (oldType === "array" &&
            property.items?.objectProperties?.length > 0)) &&
        newType !== "object" &&
        newType !== "array"
      );
    },
    [property]
  );

  const applyTypeChange = useCallback(
    (newType) => {
      const updates = { type: newType };
      if (newType === "object" && !property.properties) {
        updates.properties = [];
      }
      if (newType === "array" && !property.items) {
        updates.items = { type: "text" };
      }
      if (newType !== "object") {
        updates.properties = undefined;
      }
      if (newType !== "array") {
        updates.items = undefined;
      }
      onUpdate(property.id, updates);
    },
    [onUpdate, property]
  );

  const handleTypeChange = useCallback(
    (newType) => {
      if (checkNestedDataLoss(property.type, newType)) {
        showConfirmDialog(
          "Changing type will remove nested properties. Continue?",
          () => applyTypeChange(newType)
        );
      } else {
        applyTypeChange(newType);
      }
    },
    [property.type, checkNestedDataLoss, showConfirmDialog, applyTypeChange]
  );

  const applyItemTypeChange = useCallback(
    (newItemType) => {
      const newItems = { type: newItemType };
      if (newItemType === "object") {
        newItems.objectProperties = property.items?.objectProperties || [];
      }
      onUpdate(property.id, { items: newItems });
    },
    [onUpdate, property]
  );

  const handleItemTypeChange = useCallback(
    (newItemType) => {
      if (checkNestedDataLoss(property.items?.type, newItemType, true)) {
        showConfirmDialog(
          "Changing item type will remove nested properties. Continue?",
          () => applyItemTypeChange(newItemType)
        );
      } else {
        applyItemTypeChange(newItemType);
      }
    },
    [
      property.items?.type,
      checkNestedDataLoss,
      showConfirmDialog,
      applyItemTypeChange,
    ]
  );

  // Determine nested children and whether this property can have them
  const isObjectType = property.type === "object";
  const isArrayOfObjects = property.type === "array" && property.items?.type === "object";
  const canHaveChildren = isObjectType || isArrayOfObjects;
  const nestedChildren = isObjectType
    ? property.properties || []
    : isArrayOfObjects
      ? property.items?.objectProperties || []
      : [];

  return (
    <div style={{ marginLeft: level * 4 }}>
      <div className="group flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 min-w-0 flex-1">
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
            <div className="w-7" />
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
              onClick={() => startEditing("name", property.name)}
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
              options={PROPERTY_TYPES_OPTIONS}
              onChange={handleTypeChange}
              isOpen={isTypeDropdownOpen}
              onToggle={setIsTypeDropdownOpen}
            />
            {property.type === "array" && (
              <>
                <span className="text-xs text-gray-400">of</span>
                <Select
                  value={property.items?.type || "text"}
                  options={ARRAYITEM_TYPES_OPTIONS}
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
          {isArrayOfObjects && (
            <div className="text-xs text-gray-500 mb-2 font-medium">
              Array item properties:
            </div>
          )}

          {nestedChildren.length === 0 ? (
            <HelperMessage className="italic mb-2">
              No nested properties yet
            </HelperMessage>
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

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onConfirm={() => {
          confirmDialog.onConfirm?.();
          closeConfirmDialog();
        }}
        onCancel={closeConfirmDialog}
        title="Confirm Change"
        message={confirmDialog.message}
        confirmLabel="Continue"
      />
    </div>
  );
}
