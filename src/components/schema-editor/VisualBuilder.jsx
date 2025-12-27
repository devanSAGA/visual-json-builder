import { useState } from 'react'
import { Button, Modal } from '../ui'
import PropertyForm from './PropertyForm'
import useSchemaStore from '../../store/useSchemaStore'

export default function VisualBuilder() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { schema, addProperty, deleteProperty } = useSchemaStore()

  const handleAddProperty = (formData) => {
    addProperty(formData)
    setIsModalOpen(false)
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
            <div
              key={prop.id}
              className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-gray-900">{prop.name}</span>
                <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {prop.type}
                </span>
                {prop.required && (
                  <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
                    required
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteProperty(prop.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
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
    </div>
  )
}
