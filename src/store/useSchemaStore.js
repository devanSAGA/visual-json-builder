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
  jsonInput: '',
  validationErrors: [],
}

// Helper: Find property by ID anywhere in the tree
function findPropertyById(properties, id) {
  for (const prop of properties) {
    if (prop.id === id) return prop
    if (prop.properties) {
      const found = findPropertyById(prop.properties, id)
      if (found) return found
    }
    if (prop.items?.objectProperties) {
      const found = findPropertyById(prop.items.objectProperties, id)
      if (found) return found
    }
  }
  return null
}

// Helper: Update property in nested tree (immutable)
function updatePropertyInTree(properties, targetId, updateFn) {
  return properties.map(prop => {
    if (prop.id === targetId) {
      return updateFn(prop)
    }
    const updated = { ...prop }
    if (prop.properties) {
      updated.properties = updatePropertyInTree(prop.properties, targetId, updateFn)
    }
    if (prop.items?.objectProperties) {
      updated.items = {
        ...prop.items,
        objectProperties: updatePropertyInTree(prop.items.objectProperties, targetId, updateFn)
      }
    }
    return updated
  })
}

// Helper: Delete property from nested tree (immutable)
function deleteFromTree(properties, targetId) {
  return properties
    .filter(prop => prop.id !== targetId)
    .map(prop => {
      const updated = { ...prop }
      if (prop.properties) {
        updated.properties = deleteFromTree(prop.properties, targetId)
      }
      if (prop.items?.objectProperties) {
        updated.items = {
          ...prop.items,
          objectProperties: deleteFromTree(prop.items.objectProperties, targetId)
        }
      }
      return updated
    })
}

// Helper: Add property to a parent (for nested additions)
function addToParent(properties, parentId, newProperty, isArrayItem = false) {
  return properties.map(prop => {
    if (prop.id === parentId) {
      if (isArrayItem && prop.items) {
        return {
          ...prop,
          items: {
            ...prop.items,
            objectProperties: [...(prop.items.objectProperties || []), newProperty]
          }
        }
      } else if (prop.properties !== undefined) {
        return {
          ...prop,
          properties: [...prop.properties, newProperty]
        }
      }
    }
    const updated = { ...prop }
    if (prop.properties) {
      updated.properties = addToParent(prop.properties, parentId, newProperty, isArrayItem)
    }
    if (prop.items?.objectProperties) {
      updated.items = {
        ...prop.items,
        objectProperties: addToParent(prop.items.objectProperties, parentId, newProperty, isArrayItem)
      }
    }
    return updated
  })
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

  // Property actions - now support nested properties
  addProperty: (property, parentId = null, isArrayItem = false) =>
    set((state) => {
      const newProperty = {
        id: uuidv4(),
        name: property.name,
        type: property.type,
        description: property.description || '',
        required: property.required || false,
        validation: getDefaultValidation(property.type),
        ...(property.type === 'object' ? { properties: [] } : {}),
        ...(property.type === 'array' ? { items: property.items || { type: 'text' } } : {}),
      }

      if (!parentId) {
        return {
          schema: {
            ...state.schema,
            properties: [...state.schema.properties, newProperty],
          },
        }
      }

      return {
        schema: {
          ...state.schema,
          properties: addToParent(state.schema.properties, parentId, newProperty, isArrayItem),
        },
      }
    }),

  updateProperty: (id, updates) =>
    set((state) => ({
      schema: {
        ...state.schema,
        properties: updatePropertyInTree(state.schema.properties, id, (prop) => ({
          ...prop,
          ...updates,
        })),
      },
    })),

  deleteProperty: (id) =>
    set((state) => ({
      schema: {
        ...state.schema,
        properties: deleteFromTree(state.schema.properties, id),
      },
    })),

  // Get property by ID (for finding nested properties)
  getPropertyById: (id) => {
    const state = useSchemaStore.getState()
    return findPropertyById(state.schema.properties, id)
  },

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
        // Note: itemType removed - now using property.items.types[]
      }
    case 'null':
      return {}
    default:
      return {}
  }
}

export default useSchemaStore
