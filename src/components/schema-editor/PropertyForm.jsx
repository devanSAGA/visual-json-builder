import { useState } from 'react'
import { Button, Input, RadioGroup, Checkbox } from '../ui'

const typeOptions = [
  { value: 'text', label: 'Text', description: 'String values' },
  { value: 'number', label: 'Number', description: 'Numeric values' },
  { value: 'boolean', label: 'Boolean', description: 'True or false' },
  { value: 'null', label: 'Null', description: 'Null value only' },
]

export default function PropertyForm({ initialValues, onSubmit, onCancel }) {
  const isEditing = initialValues !== null && initialValues !== undefined
  const [formData, setFormData] = useState({
    name: initialValues?.name ?? '',
    description: initialValues?.description ?? '',
    type: initialValues?.type ?? 'text',
    required: initialValues?.required ?? false,
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Property Name"
        id="property-name"
        placeholder="e.g. username, email, age"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        required
      />

      <Input
        label="Description"
        id="property-description"
        placeholder="Optional description for this property"
        value={formData.description}
        onChange={(e) => handleChange('description', e.target.value)}
      />

      <RadioGroup
        label="Type"
        name="property-type"
        options={typeOptions}
        value={formData.type}
        onChange={(value) => handleChange('type', value)}
      />

      <Checkbox
        label="Required field"
        id="property-required"
        checked={formData.required}
        onChange={(checked) => handleChange('required', checked)}
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {isEditing ? 'Save Changes' : 'Add Property'}
        </Button>
      </div>
    </form>
  )
}
