import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { Button, Input, Checkbox } from "../ui";

// Configuration for each property type's validation rules
export const VALIDATION_CONFIG = {
  text: [
    { field: "minLength", label: "Min Length", type: "number", min: 0, placeholder: "e.g. 1", parse: parseInt },
    { field: "maxLength", label: "Max Length", type: "number", min: 0, placeholder: "e.g. 100", parse: parseInt },
    { field: "pattern", label: "Pattern (Regex)", type: "text", placeholder: "e.g. ^[a-zA-Z]+$" },
    { field: "enum", type: "enum" },
  ],
  number: [
    { field: "minimum", label: "Min Value", type: "number", placeholder: "e.g. 0", parse: parseFloat },
    { field: "maximum", label: "Max Value", type: "number", placeholder: "e.g. 100", parse: parseFloat },
    { field: "multipleOf", label: "Multiple Of", type: "number", min: 0, step: "any", placeholder: "e.g. 5", parse: parseFloat, hint: "Value must be divisible by this number" },
  ],
  boolean: [
    { field: "booleanAllowed", type: "booleanCheckboxes" },
  ],
  array: [
    { field: "minItems", label: "Min Items", type: "number", min: 0, placeholder: "e.g. 1", parse: parseInt },
    { field: "maxItems", label: "Max Items", type: "number", min: 0, placeholder: "e.g. 10", parse: parseInt },
    { field: "uniqueItems", label: "Unique items only", type: "checkbox", hint: "When enabled, all items in the array must be unique" },
  ],
};

/**
 * Check if a validation object has any values set
 */
export function hasValidationValues(validation) {
  if (!validation) return false;
  return !!(
    validation.minLength ||
    validation.maxLength ||
    validation.pattern ||
    validation.enum?.length ||
    validation.minimum != null ||
    validation.maximum != null ||
    validation.multipleOf ||
    validation.allowTrue === false ||
    validation.allowFalse === false ||
    validation.minItems != null ||
    validation.maxItems != null ||
    validation.uniqueItems
  );
}

function NumberInput({ field, label, validation, onChange, ...inputProps }) {
  const { parse = parseInt, hint, ...restProps } = inputProps;
  return (
    <div>
      <Input
        label={label}
        id={field}
        type="number"
        value={validation[field] ?? ""}
        onChange={(e) => onChange(field, e.target.value ? parse(e.target.value, 10) : null)}
        {...restProps}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function TextInput({ field, label, validation, onChange, ...inputProps }) {
  return (
    <Input
      label={label}
      id={field}
      value={validation[field] ?? ""}
      onChange={(e) => onChange(field, e.target.value || null)}
      {...inputProps}
    />
  );
}

function EnumInput({ validation, onChange }) {
  const [enumInput, setEnumInput] = useState("");

  const handleAddEnumValue = (e) => {
    if (e.key === "Enter" && enumInput.trim()) {
      e.preventDefault();
      const newValue = enumInput.trim();
      const currentEnum = validation.enum || [];
      if (!currentEnum.includes(newValue)) {
        onChange("enum", [...currentEnum, newValue]);
      }
      setEnumInput("");
    }
  };

  const handleRemoveEnumValue = (valueToRemove) => {
    onChange("enum", (validation.enum || []).filter((v) => v !== valueToRemove));
  };

  return (
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
      {validation.enum?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {validation.enum.map((value) => (
            <span
              key={value}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {value}
              <button
                type="button"
                onClick={() => handleRemoveEnumValue(value)}
                className="p-0 hover:text-blue-600"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-500 mt-1">Restrict to specific values</p>
    </div>
  );
}

function BooleanCheckboxes({ validation, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Allowed Values
      </label>
      <div className="space-y-2">
        <Checkbox
          label="True"
          id="allow-true"
          checked={validation.allowTrue !== false}
          onChange={(checked) => onChange("allowTrue", checked)}
        />
        <Checkbox
          label="False"
          id="allow-false"
          checked={validation.allowFalse !== false}
          onChange={(checked) => onChange("allowFalse", checked)}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Restrict to only true or only false
      </p>
    </div>
  );
}

function CheckboxInput({ field, label, validation, onChange, hint }) {
  return (
    <div>
      <Checkbox
        label={label}
        id={field}
        checked={validation[field] || false}
        onChange={(checked) => onChange(field, checked)}
      />
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function ValidationRuleInputs({ type, validation, onChange }) {
  const config = VALIDATION_CONFIG[type];
  if (!config) return null;

  return (
    <div className="space-y-3">
      {config.map((rule) => {
        switch (rule.type) {
          case "number":
            return (
              <NumberInput
                key={rule.field}
                field={rule.field}
                label={rule.label}
                validation={validation}
                onChange={onChange}
                min={rule.min}
                step={rule.step}
                placeholder={rule.placeholder}
                parse={rule.parse}
                hint={rule.hint}
              />
            );
          case "text":
            return (
              <TextInput
                key={rule.field}
                field={rule.field}
                label={rule.label}
                validation={validation}
                onChange={onChange}
                placeholder={rule.placeholder}
              />
            );
          case "enum":
            return <EnumInput key="enum" validation={validation} onChange={onChange} />;
          case "booleanCheckboxes":
            return <BooleanCheckboxes key="boolean" validation={validation} onChange={onChange} />;
          case "checkbox":
            return (
              <CheckboxInput
                key={rule.field}
                field={rule.field}
                label={rule.label}
                validation={validation}
                onChange={onChange}
                hint={rule.hint}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

export default function ValidationRulesPanel({
  type,
  validation,
  onChange,
  isExpanded,
  onToggleExpand,
}) {
  const hasValidationRules = type in VALIDATION_CONFIG;

  if (!hasValidationRules) {
    return (
      <div className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-200 rounded-lg text-sm text-gray-400 flex flex-col items-center justify-center gap-1 cursor-not-allowed bg-gray-50">
        <PlusCircle size={24} className="text-gray-300" />
        <span>No validation rules</span>
        <span className="text-xs text-gray-300">Not available for this type</span>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={onToggleExpand}
        className="w-full h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50 flex flex-col items-center justify-center gap-1"
      >
        <PlusCircle size={24} className="text-gray-400" />
        <span>Add validation</span>
        <span className="text-xs text-gray-400">(optional)</span>
      </Button>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-700">Validation Rules</h3>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleExpand}
        >
          <X size={16} />
        </Button>
      </div>
      <ValidationRuleInputs type={type} validation={validation} onChange={onChange} />
    </div>
  );
}
