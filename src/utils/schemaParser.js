import { v4 as uuidv4 } from 'uuid'

// Map JSON Schema type to internal type
const reverseTypeMap = {
  string: 'text',
  number: 'number',
  integer: 'number',
  boolean: 'boolean',
  object: 'object',
  array: 'array',
  null: 'null',
}

// Parse JSON Schema to internal format
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

// Parse a single property from JSON Schema
function parseProperty(name, propSchema, requiredFields) {
  const type = reverseTypeMap[propSchema.type] || 'text'

  return {
    id: uuidv4(),
    name,
    type,
    description: propSchema.description || '',
    required: requiredFields.includes(name),
    validation: parseValidation(type, propSchema),
  }
}

// Parse validation rules based on type
function parseValidation(type, propSchema) {
  switch (type) {
    case 'text':
      return {
        minLength: propSchema.minLength ?? null,
        maxLength: propSchema.maxLength ?? null,
        pattern: propSchema.pattern ?? null,
        format: propSchema.format ?? null,
      }
    case 'number':
      return {
        minimum: propSchema.minimum ?? null,
        maximum: propSchema.maximum ?? null,
        exclusiveMinimum: propSchema.exclusiveMinimum ?? null,
        exclusiveMaximum: propSchema.exclusiveMaximum ?? null,
        multipleOf: propSchema.multipleOf ?? null,
      }
    case 'boolean':
      return {}
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
        itemType: propSchema.items?.type
          ? reverseTypeMap[propSchema.items.type] || 'text'
          : 'text',
      }
    case 'null':
      return {}
    default:
      return {}
  }
}

export default parseJsonSchema
