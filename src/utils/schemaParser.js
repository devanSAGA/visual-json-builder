import { v4 as uuidv4 } from 'uuid'

const reverseTypeMap = {
  string: 'text',
  number: 'number',
  integer: 'number',
  boolean: 'boolean',
  object: 'object',
  array: 'array',
  null: 'null',
}

export function parseJsonSchema(jsonSchema) {
  const schema = {
    title: jsonSchema.title || '',
    description: jsonSchema.description || '',
    properties: [],
  }

  const requiredFields = jsonSchema.required || []

  if (jsonSchema.properties) {
    for (const [name, propSchema] of Object.entries(jsonSchema.properties)) {
      schema.properties.push(parseProperty(name, propSchema, requiredFields))
    }
  }

  return schema
}

function parseProperty(name, propSchema, requiredFields) {
  const type = reverseTypeMap[propSchema.type] || 'text'

  const property = {
    id: uuidv4(),
    name,
    type,
    description: propSchema.description || '',
    required: requiredFields.includes(name),
    validation: parseValidation(type, propSchema),
  }

  if (type === 'object' && propSchema.properties) {
    property.properties = []
    const nestedRequired = propSchema.required || []
    for (const [nestedName, nestedSchema] of Object.entries(propSchema.properties)) {
      property.properties.push(parseProperty(nestedName, nestedSchema, nestedRequired))
    }
  }

  if (type === 'array') {
    property.items = parseArrayItems(propSchema.items)
  }

  return property
}

function parseArrayItems(itemsSchema) {
  if (!itemsSchema) {
    return { type: 'text' }
  }

  const itemType = reverseTypeMap[itemsSchema.type] || 'text'

  if (itemType === 'object' && itemsSchema.properties) {
    const objectProperties = []
    const requiredFields = itemsSchema.required || []
    for (const [propName, propSchema] of Object.entries(itemsSchema.properties)) {
      objectProperties.push(parseProperty(propName, propSchema, requiredFields))
    }
    return { type: 'object', objectProperties }
  }

  return { type: itemType }
}

function parseValidation(type, propSchema) {
  switch (type) {
    case 'text':
      return {
        minLength: propSchema.minLength ?? null,
        maxLength: propSchema.maxLength ?? null,
        pattern: propSchema.pattern ?? null,
        format: propSchema.format ?? null,
        enum: propSchema.enum ?? [],
      }
    case 'number':
      return {
        minimum: propSchema.minimum ?? null,
        maximum: propSchema.maximum ?? null,
        exclusiveMinimum: propSchema.exclusiveMinimum ?? null,
        exclusiveMaximum: propSchema.exclusiveMaximum ?? null,
        multipleOf: propSchema.multipleOf ?? null,
      }
    case 'boolean': {
      const enumVal = propSchema.enum
      if (Array.isArray(enumVal) && enumVal.length === 1) {
        return {
          allowTrue: enumVal.includes(true),
          allowFalse: enumVal.includes(false),
        }
      }
      return { allowTrue: true, allowFalse: true }
    }
    case 'object':
      return {
        minProperties: propSchema.minProperties ?? null,
        maxProperties: propSchema.maxProperties ?? null,
        additionalProperties: propSchema.additionalProperties ?? true,
      }
    case 'array':
      return {
        minItems: propSchema.minItems ?? null,
        maxItems: propSchema.maxItems ?? null,
        uniqueItems: propSchema.uniqueItems ?? false,
      }
    case 'null':
      return {}
    default:
      return {}
  }
}

export default parseJsonSchema
