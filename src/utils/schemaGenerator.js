// Map internal type to JSON Schema type
const typeMap = {
  text: 'string',
  number: 'number',
  boolean: 'boolean',
  object: 'object',
  array: 'array',
  null: 'null',
}

// Generate JSON Schema from internal state
export function generateJsonSchema(schema) {
  const jsonSchema = {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {},
    required: [],
    additionalProperties: false,
  }

  if (schema.title) {
    jsonSchema.title = schema.title
  }

  if (schema.description) {
    jsonSchema.description = schema.description
  }

  for (const prop of schema.properties) {
    jsonSchema.properties[prop.name] = generatePropertySchema(prop)

    if (prop.required) {
      jsonSchema.required.push(prop.name)
    }
  }

  // Remove required array if empty
  if (jsonSchema.required.length === 0) {
    delete jsonSchema.required
  }

  return jsonSchema
}

// Generate schema for a single property
function generatePropertySchema(prop) {
  const propSchema = {
    type: typeMap[prop.type] || 'string',
  }

  if (prop.description) {
    propSchema.description = prop.description
  }

  // Add validation rules based on type
  switch (prop.type) {
    case 'text':
      addTextValidation(propSchema, prop.validation)
      break
    case 'number':
      addNumberValidation(propSchema, prop.validation)
      break
    case 'array':
      addArrayValidation(propSchema, prop.validation)
      break
    case 'object':
      addObjectValidation(propSchema, prop.validation)
      break
  }

  return propSchema
}

function addTextValidation(schema, validation) {
  if (validation.minLength !== null) {
    schema.minLength = validation.minLength
  }
  if (validation.maxLength !== null) {
    schema.maxLength = validation.maxLength
  }
  if (validation.pattern) {
    schema.pattern = validation.pattern
  }
  if (validation.format) {
    schema.format = validation.format
  }
}

function addNumberValidation(schema, validation) {
  if (validation.minimum !== null) {
    schema.minimum = validation.minimum
  }
  if (validation.maximum !== null) {
    schema.maximum = validation.maximum
  }
  if (validation.exclusiveMinimum !== null) {
    schema.exclusiveMinimum = validation.exclusiveMinimum
  }
  if (validation.exclusiveMaximum !== null) {
    schema.exclusiveMaximum = validation.exclusiveMaximum
  }
  if (validation.multipleOf !== null) {
    schema.multipleOf = validation.multipleOf
  }
}

function addArrayValidation(schema, validation) {
  if (validation.minItems !== null) {
    schema.minItems = validation.minItems
  }
  if (validation.maxItems !== null) {
    schema.maxItems = validation.maxItems
  }
  if (validation.uniqueItems) {
    schema.uniqueItems = true
  }
  if (validation.itemType) {
    schema.items = { type: typeMap[validation.itemType] || 'string' }
  }
}

function addObjectValidation(schema, validation) {
  if (validation.minProperties !== null) {
    schema.minProperties = validation.minProperties
  }
  if (validation.maxProperties !== null) {
    schema.maxProperties = validation.maxProperties
  }
  if (validation.additionalProperties !== undefined) {
    schema.additionalProperties = validation.additionalProperties
  }
}

export default generateJsonSchema
