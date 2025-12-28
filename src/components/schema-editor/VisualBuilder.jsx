import { useState } from 'react'
import { Button, Modal } from '../ui'
import PropertyForm from './PropertyForm'
import PropertyRow from './PropertyRow'
import useSchemaStore from '../../store/useSchemaStore'

export default function VisualBuilder() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const { schema, addProperty, updateProperty, deleteProperty } = useSchemaStore()

  const handleAddProperty = (formData) => {
    addProperty(formData)
    setIsModalOpen(false)
  }

  const handleEditProperty = (formData) => {
    updateProperty(editingProperty.id, formData)
    setEditingProperty(null)
  }

  const openEditModal = (property) => {
    setEditingProperty(property)
  }

  return (
    <div className="p-4 h-full overflow-auto">
      <Button onClick={() => setIsModalOpen(true)}>
        + Add Property
      </Button>

      {schema.properties.length === 0 ? (
        <div className="mt-4 text-gray-500 text-sm">
          No properties defined yet. Click "Add Property" to get started.
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {schema.properties.map((prop) => (
            <PropertyRow
              key={prop.id}
              property={prop}
              onUpdate={updateProperty}
              onDelete={deleteProperty}
              onEditFull={openEditModal}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Property"
      >
        <PropertyForm
          onSubmit={handleAddProperty}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={editingProperty !== null}
        onClose={() => setEditingProperty(null)}
        title="Edit Property"
      >
        <PropertyForm
          initialValues={editingProperty}
          onSubmit={handleEditProperty}
          onCancel={() => setEditingProperty(null)}
        />
      </Modal>
    </div>
  )
}
