import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_JSON_SCHEMA } from "../constants";

const initialState = DEFAULT_JSON_SCHEMA;

function getDefaultValidation(type) {
  switch (type) {
    case "text":
      return {
        minLength: null,
        maxLength: null,
        pattern: null,
        enum: [],
      };
    case "number":
      return {
        minimum: null,
        maximum: null,
        multipleOf: null,
      };
    case "boolean":
      return {
        allowTrue: true,
        allowFalse: true,
      };
    case "array":
      return {
        minItems: null,
        maxItems: null,
        uniqueItems: false,
      };
    default:
      return {};
  }
}

function findPropertyById(properties, id) {
  for (const prop of properties) {
    if (prop.id === id) return prop;
    if (prop.properties) {
      const found = findPropertyById(prop.properties, id);
      if (found) return found;
    }
    if (prop.items?.objectProperties) {
      const found = findPropertyById(prop.items.objectProperties, id);
      if (found) return found;
    }
  }
  return null;
}

function updatePropertyInTree(properties, targetId, updateFn) {
  return properties.map((prop) => {
    if (prop.id === targetId) {
      return updateFn(prop);
    }
    const updated = { ...prop };
    if (prop.properties) {
      updated.properties = updatePropertyInTree(
        prop.properties,
        targetId,
        updateFn
      );
    }
    if (prop.items?.objectProperties) {
      updated.items = {
        ...prop.items,
        objectProperties: updatePropertyInTree(
          prop.items.objectProperties,
          targetId,
          updateFn
        ),
      };
    }
    return updated;
  });
}

function deleteFromTree(properties, targetId) {
  return properties
    .filter((prop) => prop.id !== targetId)
    .map((prop) => {
      const updated = { ...prop };
      if (prop.properties) {
        updated.properties = deleteFromTree(prop.properties, targetId);
      }
      if (prop.items?.objectProperties) {
        updated.items = {
          ...prop.items,
          objectProperties: deleteFromTree(
            prop.items.objectProperties,
            targetId
          ),
        };
      }
      return updated;
    });
}

function addToParent(properties, parentId, newProperty, isArrayItem = false) {
  return properties.map((prop) => {
    if (prop.id === parentId) {
      if (isArrayItem && prop.items) {
        return {
          ...prop,
          items: {
            ...prop.items,
            objectProperties: [
              ...(prop.items.objectProperties || []),
              newProperty,
            ],
          },
        };
      } else if (prop.properties !== undefined) {
        return {
          ...prop,
          properties: [...prop.properties, newProperty],
        };
      }
    }
    const updated = { ...prop };
    if (prop.properties) {
      updated.properties = addToParent(
        prop.properties,
        parentId,
        newProperty,
        isArrayItem
      );
    }
    if (prop.items?.objectProperties) {
      updated.items = {
        ...prop.items,
        objectProperties: addToParent(
          prop.items.objectProperties,
          parentId,
          newProperty,
          isArrayItem
        ),
      };
    }
    return updated;
  });
}

const useSchemaStore = create((set) => ({
  ...initialState,

  addProperty: (property, parentId = null, isArrayItem = false) =>
    set((state) => {
      const defaultValidation = getDefaultValidation(property.type);
      const newProperty = {
        id: uuidv4(),
        name: property.name,
        type: property.type,
        description: property.description || "",
        required: property.required || false,
        validation: property.validation
          ? { ...defaultValidation, ...property.validation }
          : defaultValidation,
        ...(property.type === "object" ? { properties: [] } : {}),
        ...(property.type === "array"
          ? { items: property.items || { type: "text" } }
          : {}),
      };

      if (!parentId) {
        return {
          schema: {
            ...state.schema,
            properties: [...state.schema.properties, newProperty],
          },
        };
      }

      return {
        schema: {
          ...state.schema,
          properties: addToParent(
            state.schema.properties,
            parentId,
            newProperty,
            isArrayItem
          ),
        },
      };
    }),

  updateProperty: (id, updates) =>
    set((state) => ({
      schema: {
        ...state.schema,
        properties: updatePropertyInTree(
          state.schema.properties,
          id,
          (prop) => ({
            ...prop,
            ...updates,
          })
        ),
      },
    })),

  deleteProperty: (id) =>
    set((state) => ({
      schema: {
        ...state.schema,
        properties: deleteFromTree(state.schema.properties, id),
      },
    })),

  reorderProperties: (fromIndex, toIndex) =>
    set((state) => {
      const properties = [...state.schema.properties];
      const [removed] = properties.splice(fromIndex, 1);
      properties.splice(toIndex, 0, removed);
      return {
        schema: { ...state.schema, properties },
      };
    }),

  setSchema: (schema) => set({ schema }),

  resetSchema: () => set({ schema: initialState.schema }),

  setJsonInput: (jsonInput) => set({ jsonInput }),

  setValidationErrors: (validationErrors) => set({ validationErrors }),
}));

export const getPropertyById = (id) => {
  const state = useSchemaStore.getState();
  return findPropertyById(state.schema.properties, id);
};

export default useSchemaStore;
