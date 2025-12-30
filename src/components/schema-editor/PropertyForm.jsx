import { useState } from "react";
import { Plus, PlusCircle, PlusSquare, X } from "lucide-react";
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
    validation: initialValues?.validation ?? {
      minLength: null,
      maxLength: null,
      pattern: null,
      enum: [],
    },
  });
  const [errors, setErrors] = useState({});
  const [enumInput, setEnumInput] = useState("");
  const [showValidation, setShowValidation] = useState(
    // Auto-expand if validation rules are already set
    !!(
      // Text validation
      (
        initialValues?.validation?.minLength ||
        initialValues?.validation?.maxLength ||
        initialValues?.validation?.pattern ||
        initialValues?.validation?.enum?.length ||
        // Number validation
        (initialValues?.validation?.minimum !== null &&
          initialValues?.validation?.minimum !== undefined) ||
        (initialValues?.validation?.maximum !== null &&
          initialValues?.validation?.maximum !== undefined) ||
        initialValues?.validation?.multipleOf ||
        // Boolean validation (show if either is restricted)
        initialValues?.validation?.allowTrue === false ||
        initialValues?.validation?.allowFalse === false ||
        // Array validation
        (initialValues?.validation?.minItems !== null &&
          initialValues?.validation?.minItems !== undefined) ||
        (initialValues?.validation?.maxItems !== null &&
          initialValues?.validation?.maxItems !== undefined) ||
        initialValues?.validation?.uniqueItems
      )
    )
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

  const handleAddEnumValue = (e) => {
    if (e.key === "Enter" && enumInput.trim()) {
      e.preventDefault();
      const newValue = enumInput.trim();
      const currentEnum = formData.validation.enum || [];
      if (!currentEnum.includes(newValue)) {
        handleValidationChange("enum", [...currentEnum, newValue]);
      }
      setEnumInput("");
    }
  };

  const handleRemoveEnumValue = (valueToRemove) => {
    handleValidationChange(
      "enum",
      (formData.validation.enum || []).filter((v) => v !== valueToRemove)
    );
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

  const showValidationPanel = true; // Always show to prevent layout shift
  const hasValidationRules =
    formData.type === "text" ||
    formData.type === "number" ||
    formData.type === "boolean" ||
    formData.type === "array";

  return (
    <form onSubmit={handleSubmit}>
      <div className={showValidationPanel ? "flex gap-6" : ""}>
        {/* Left side - Main form fields */}
        <div className={showValidationPanel ? "w-3/5 space-y-4" : "space-y-4"}>
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
        </div>

        {/* Right side - Validation Rules */}
        {showValidationPanel && (
          <div className="w-2/5">
            {!hasValidationRules ? (
              <div className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 flex flex-col items-center justify-center gap-1 cursor-not-allowed bg-gray-50">
                <PlusCircle size={24} className="text-gray-300" />
                <span>No validation rules</span>
                <span className="text-xs text-gray-300">
                  Not available for this type
                </span>
              </div>
            ) : !showValidation ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowValidation(true)}
                className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 flex flex-col items-center justify-center gap-1"
              >
                <PlusCircle size={24} className="text-gray-400" />
                <span>Add validation</span>
                <span className="text-xs text-gray-400">(optional)</span>
              </Button>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-full">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700">
                    Validation Rules
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowValidation(false)}
                  >
                    <X size={16} />
                  </Button>
                </div>

                <div className="space-y-3">
                  {/* Text type validation rules */}
                  {formData.type === "text" && (
                    <>
                      <Input
                        label="Min Length"
                        id="min-length"
                        type="number"
                        min="0"
                        placeholder="e.g. 1"
                        value={formData.validation.minLength ?? ""}
                        onChange={(e) =>
                          handleValidationChange(
                            "minLength",
                            e.target.value ? parseInt(e.target.value, 10) : null
                          )
                        }
                      />
                      <Input
                        label="Max Length"
                        id="max-length"
                        type="number"
                        min="0"
                        placeholder="e.g. 100"
                        value={formData.validation.maxLength ?? ""}
                        onChange={(e) =>
                          handleValidationChange(
                            "maxLength",
                            e.target.value ? parseInt(e.target.value, 10) : null
                          )
                        }
                      />

                      <Input
                        label="Pattern (Regex)"
                        id="pattern"
                        placeholder="e.g. ^[a-zA-Z]+$"
                        value={formData.validation.pattern ?? ""}
                        onChange={(e) =>
                          handleValidationChange(
                            "pattern",
                            e.target.value || null
                          )
                        }
                      />

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Allowed Values
                        </label>
                        <input
                          type="text"
                          placeholder="Type and press Enter"
                          value={enumInput}
                          onChange={(e) => setEnumInput(e.target.value)}
                          onKeyDown={handleAddEnumValue}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        {formData.validation.enum?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {formData.validation.enum.map((value) => (
                              <span
                                key={value}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
                              >
                                {value}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleRemoveEnumValue(value)}
                                  className="p-0 h-auto hover:bg-transparent hover:text-blue-600"
                                >
                                  <X size={12} />
                                </Button>
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Restrict to specific values
                        </p>
                      </div>
                    </>
                  )}

                  {/* Number type validation rules */}
                  {formData.type === "number" && (
                    <>
                      <Input
                        label="Min Value"
                        id="minimum"
                        type="number"
                        placeholder="e.g. 0"
                        value={formData.validation.minimum ?? ""}
                        onChange={(e) =>
                          handleValidationChange(
                            "minimum",
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                      />
                      <Input
                        label="Max Value"
                        id="maximum"
                        type="number"
                        placeholder="e.g. 100"
                        value={formData.validation.maximum ?? ""}
                        onChange={(e) =>
                          handleValidationChange(
                            "maximum",
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                      />
                      <Input
                        label="Multiple Of"
                        id="multipleOf"
                        type="number"
                        min="0"
                        step="any"
                        placeholder="e.g. 5"
                        value={formData.validation.multipleOf ?? ""}
                        onChange={(e) =>
                          handleValidationChange(
                            "multipleOf",
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                      />
                      <p className="text-xs text-gray-500">
                        Value must be divisible by this number
                      </p>
                    </>
                  )}

                  {/* Boolean type validation rules */}
                  {formData.type === "boolean" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Allowed Values
                        </label>
                        <div className="space-y-2">
                          <Checkbox
                            label="True"
                            id="allow-true"
                            checked={formData.validation.allowTrue !== false}
                            onChange={(checked) =>
                              handleValidationChange("allowTrue", checked)
                            }
                          />
                          <Checkbox
                            label="False"
                            id="allow-false"
                            checked={formData.validation.allowFalse !== false}
                            onChange={(checked) =>
                              handleValidationChange("allowFalse", checked)
                            }
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Restrict to only true or only false
                        </p>
                      </div>
                    </>
                  )}

                  {/* Array type validation rules */}
                  {formData.type === "array" && (
                    <>
                      <Input
                        label="Min Items"
                        id="min-items"
                        type="number"
                        min="0"
                        placeholder="e.g. 1"
                        value={formData.validation.minItems ?? ""}
                        onChange={(e) =>
                          handleValidationChange(
                            "minItems",
                            e.target.value ? parseInt(e.target.value, 10) : null
                          )
                        }
                      />
                      <Input
                        label="Max Items"
                        id="max-items"
                        type="number"
                        min="0"
                        placeholder="e.g. 10"
                        value={formData.validation.maxItems ?? ""}
                        onChange={(e) =>
                          handleValidationChange(
                            "maxItems",
                            e.target.value ? parseInt(e.target.value, 10) : null
                          )
                        }
                      />
                      <Checkbox
                        label="Unique items only"
                        id="unique-items"
                        checked={formData.validation.uniqueItems || false}
                        onChange={(checked) =>
                          handleValidationChange("uniqueItems", checked)
                        }
                      />
                      <p className="text-xs text-gray-500">
                        When enabled, all items in the array must be unique
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
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
