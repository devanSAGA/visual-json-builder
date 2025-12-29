import { useState } from "react";
import { Button, Input, RadioGroup, Checkbox } from "../ui";

const typeOptions = [
  { value: "text", label: "Text", description: "String values" },
  { value: "number", label: "Number", description: "Numeric values" },
  { value: "boolean", label: "Boolean", description: "True or false" },
  { value: "object", label: "Object", description: "Nested properties" },
  { value: "array", label: "Array", description: "List of items" },
  { value: "null", label: "Null", description: "Null value only" },
];

const arrayItemTypeOptions = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" },
  { value: "object", label: "Object" },
  { value: "null", label: "Null" },
];

export default function PropertyForm({ initialValues, onSubmit, onCancel }) {
  const isEditing = initialValues !== null && initialValues !== undefined;
  const [formData, setFormData] = useState({
    name: initialValues?.name ?? "",
    description: initialValues?.description ?? "",
    type: initialValues?.type ?? "text",
    required: initialValues?.required ?? false,
    items: initialValues?.items ?? { type: "text" },
    properties: initialValues?.properties ?? [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Property name is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTypeChange = (newType) => {
    const updates = { type: newType };
    // Initialize items for array type
    if (newType === "array" && !formData.items) {
      updates.items = { type: "text" };
    }
    // Initialize properties for object type
    if (newType === "object") {
      updates.properties = formData.properties || [];
    }
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleItemTypeChange = (itemType) => {
    const newItems = { type: itemType };
    // Initialize objectProperties if object type is selected
    if (itemType === "object") {
      newItems.objectProperties = formData.items?.objectProperties || [];
    }
    setFormData((prev) => ({ ...prev, items: newItems }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    const dataToSubmit = { ...formData };
    // Ensure properties array exists for object type
    if (formData.type === "object" && !dataToSubmit.properties) {
      dataToSubmit.properties = [];
    }
    onSubmit(dataToSubmit);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Property Name"
        id="property-name"
        placeholder="e.g. name, age, phone"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        autoFocus
        error={errors.name}
      />

      <Input
        label="Description"
        id="property-description"
        placeholder="Optional description for this property"
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <RadioGroup
        label="Type"
        name="property-type"
        options={typeOptions}
        value={formData.type}
        onChange={handleTypeChange}
      />

      {/* Array item type selector */}
      {formData.type === "array" && (
        <RadioGroup
          label="Item Type"
          name="array-item-type"
          options={arrayItemTypeOptions}
          value={formData.items?.type || "text"}
          onChange={handleItemTypeChange}
          variant="compact"
        />
      )}

      {formData.type === "array" && formData.items?.type === "object" && (
        <p className="text-xs text-gray-500">
          Object properties can be added after creating the array property
        </p>
      )}

      <Checkbox
        label="Required field"
        id="property-required"
        checked={formData.required}
        onChange={(checked) => handleChange("required", checked)}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? "Save Changes" : "Add Property"}
        </Button>
      </div>
    </form>
  );
}
