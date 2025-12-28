import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

const initialState = {
  schema: {
    title: '',
    description: '',
    properties: [
      {
        id: 'default-1',
        name: 'Name',
        type: 'text',
        description: '',
        required: false,
        validation: {
          minLength: null,
          maxLength: null,
          pattern: null,
          format: null,
        },
      },
      {
        id: 'default-2',
        name: 'Phone',
        type: 'number',
        description: '',
        required: false,
        validation: {
          minimum: null,
          maximum: null,
          exclusiveMinimum: null,
          exclusiveMaximum: null,
          multipleOf: null,
        },
      },
    ],
  },
  // For input validator pane (later)
  jsonInput: '',
  validationErrors: [],
}

const useSchemaStore = create((set) => ({
  ...initialState,

  // Schema metadata actions
  setSchemaTitle: (title) =>
    set((state) => ({
      schema: { ...state.schema, title },
    })),

  setSchemaDescription: (description) =>
    set((state) => ({
      schema: { ...state.schema, description },
    })),

  // Property actions
  addProperty: (property) =>
    set((state) => ({
      schema: {
        ...state.schema,
        properties: [
          ...state.schema.properties,
          {
            id: uuidv4(),
            name: property.name,
            type: property.type,
            description: property.description || '',
            required: property.required || false,
            validation: getDefaultValidation(property.type),
          },
        ],
      },
    })),

  updateProperty: (id, updates) =>
    set((state) => ({
      schema: {
        ...state.schema,
        properties: state.schema.properties.map((prop) =>
          prop.id === id ? { ...prop, ...updates } : prop
        ),
      },
    })),

  deleteProperty: (id) =>
    set((state) => ({
      schema: {
        ...state.schema,
        properties: state.schema.properties.filter((prop) => prop.id !== id),
      },
    })),

  reorderProperties: (fromIndex, toIndex) =>
    set((state) => {
      const properties = [...state.schema.properties]
      const [removed] = properties.splice(fromIndex, 1)
      properties.splice(toIndex, 0, removed)
      return {
        schema: { ...state.schema, properties },
      }
    }),

  // Bulk update (for when editing JSON Schema directly)
  setSchema: (schema) =>
    set({ schema }),

  // Reset
  resetSchema: () =>
    set({ schema: initialState.schema }),

  // Input validator actions (for later)
  setJsonInput: (jsonInput) =>
    set({ jsonInput }),

  setValidationErrors: (validationErrors) =>
    set({ validationErrors }),
}))

// Helper: default validation rules per type
function getDefaultValidation(type) {
  switch (type) {
    case 'text':
      return {
        minLength: null,
        maxLength: null,
        pattern: null,
        format: null,
      }
    case 'number':
      return {
        minimum: null,
        maximum: null,
        exclusiveMinimum: null,
        exclusiveMaximum: null,
        multipleOf: null,
      }
    case 'boolean':
      return {}
    case 'object':
      return {
        minProperties: null,
        maxProperties: null,
        additionalProperties: true,
      }
    case 'array':
      return {
        minItems: null,
        maxItems: null,
        uniqueItems: false,
        itemType: 'text',
      }
    case 'null':
      return {}
    default:
      return {}
  }
}

export default useSchemaStore
