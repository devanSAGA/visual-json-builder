import { useState, useCallback } from "react";

/**
 * Hook for managing inline editing state
 * @param {Object} options
 * @param {Function} options.onSave - Callback when edit is saved (field, value) => void
 * @param {Function} options.validate - Optional validation function (field, value) => boolean
 */
export default function useInlineEdit({ onSave, validate }) {
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = useCallback((field, initialValue) => {
    setEditingField(field);
    setEditValue(initialValue || "");
  }, []);

  const saveEdit = useCallback(() => {
    if (validate && !validate(editingField, editValue)) {
      setEditingField(null);
      return;
    }
    onSave(editingField, editValue);
    setEditingField(null);
  }, [editingField, editValue, onSave, validate]);

  const cancelEdit = useCallback(() => {
    setEditingField(null);
  }, []);

  return {
    editingField,
    editValue,
    setEditValue,
    startEditing,
    saveEdit,
    cancelEdit,
    isEditing: (field) => editingField === field,
  };
}
