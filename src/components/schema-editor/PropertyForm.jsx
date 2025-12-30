import { useState } from "react";
import { Button, Input, RadioGroup, Checkbox, HelperMessage } from "../ui";
import { ARRAYITEM_TYPES_OPTIONS, PROPERTY_TYPES_OPTIONS } from "./constants";
import ValidationRulesPanel, { hasValidationValues } from "./ValidationRulesPanel";

const DEFAULT_FORM_DATA = {
  name: "",
  description: "",
  type: "text",
  required: false,
  items: { type: "text" },
  properties: [],
  validation: { minLength: null, maxLength: null, pattern: null, enum: [] },
};

function getInitialFormData(initialValues) {
  if (!initialValues) return DEFAULT_FORM_DATA;
  return { ...DEFAULT_FORM_DATA, ...initialValues };
}

export default function PropertyForm({ initialValues, onSubmit, onCancel }) {
  const isEditing = initialValues != null;
  const [formData, setFormData] = useState(() => getInitialFormData(initialValues));
  const [errors, setErrors] = useState({});
  const [showValidation, setShowValidation] = useState(() =>
    hasValidationValues(initialValues?.validation)
  );

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

  const handleValidationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      validation: { ...prev.validation, [field]: value },
    }));
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
    <form onSubmit={handleSubmit}>
      <div className="flex gap-6">
        {/* Left side - Main form fields */}
        <div className="w-3/5 space-y-4">
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
            options={PROPERTY_TYPES_OPTIONS}
            value={formData.type}
            onChange={handleTypeChange}
          />

          {/* Array item type selector */}
          {formData.type === "array" && (
            <RadioGroup
              label="Item Type"
              name="array-item-type"
              options={ARRAYITEM_TYPES_OPTIONS}
              value={formData.items?.type || "text"}
              onChange={handleItemTypeChange}
              variant="compact"
            />
          )}

          {formData.type === "array" && formData.items?.type === "object" && (
            <HelperMessage>
              Object properties can be added after creating the array property
            </HelperMessage>
          )}

          <Checkbox
            label="Required field"
            id="property-required"
            checked={formData.required}
            onChange={(checked) => handleChange("required", checked)}
          />
        </div>

        {/* Right side - Validation Rules */}
        <div className="w-2/5">
          <ValidationRulesPanel
            type={formData.type}
            validation={formData.validation}
            onChange={handleValidationChange}
            isExpanded={showValidation}
            onToggleExpand={() => setShowValidation(!showValidation)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200">
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
