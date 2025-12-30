const typeMap = {
  text: "string",
  number: "number",
  boolean: "boolean",
  object: "object",
  array: "array",
  null: "null",
};

export function generateJsonSchema(schema) {
  const jsonSchema = {
    $schema: "http://json-schema.org/draft-07/schema#",
    type: "object",
    properties: {},
    required: [],
  };

  if (schema.title) {
    jsonSchema.title = schema.title;
  }

  if (schema.description) {
    jsonSchema.description = schema.description;
  }

  for (const prop of schema.properties) {
    jsonSchema.properties[prop.name] = generatePropertySchema(prop);

    if (prop.required) {
      jsonSchema.required.push(prop.name);
    }
  }

  if (jsonSchema.required.length === 0) {
    delete jsonSchema.required;
  }

  return jsonSchema;
}

function generatePropertySchema(prop) {
  const propSchema = {
    type: typeMap[prop.type] || "string",
  };

  if (prop.description) {
    propSchema.description = prop.description;
  }

  switch (prop.type) {
    case "text":
      addTextValidation(propSchema, prop.validation);
      break;
    case "number":
      addNumberValidation(propSchema, prop.validation);
      break;
    case "boolean":
      addBooleanValidation(propSchema, prop.validation);
      break;
    case "array":
      addArrayValidation(propSchema, prop.validation);
      if (prop.items) {
        propSchema.items = generateArrayItems(prop.items);
      }
      break;
    case "object":
      addObjectValidation(propSchema, prop.validation);
      if (prop.properties && prop.properties.length > 0) {
        propSchema.properties = {};
        propSchema.required = [];
        for (const nestedProp of prop.properties) {
          propSchema.properties[nestedProp.name] = generatePropertySchema(nestedProp);
          if (nestedProp.required) {
            propSchema.required.push(nestedProp.name);
          }
        }
        if (propSchema.required.length === 0) {
          delete propSchema.required;
        }
      }
      break;
  }

  return propSchema;
}

function generateArrayItems(items) {
  const itemType = items.type || "text";

  if (itemType === "object" && items.objectProperties?.length > 0) {
    const objectSchema = { type: "object", properties: {}, required: [] };
    for (const prop of items.objectProperties) {
      objectSchema.properties[prop.name] = generatePropertySchema(prop);
      if (prop.required) {
        objectSchema.required.push(prop.name);
      }
    }
    if (objectSchema.required.length === 0) {
      delete objectSchema.required;
    }
    return objectSchema;
  }

  return { type: typeMap[itemType] || "string" };
}

function addTextValidation(schema, validation) {
  if (!validation) return;
  if (validation.minLength !== null) {
    schema.minLength = validation.minLength;
  }
  if (validation.maxLength !== null) {
    schema.maxLength = validation.maxLength;
  }
  if (validation.pattern) {
    schema.pattern = validation.pattern;
  }
  if (validation.format) {
    schema.format = validation.format;
  }
  if (validation.enum && validation.enum.length > 0) {
    schema.enum = validation.enum;
  }
}

function addBooleanValidation(schema, validation) {
  if (!validation) return;

  const allowTrue = validation.allowTrue !== false;
  const allowFalse = validation.allowFalse !== false;

  if (!allowTrue && allowFalse) {
    schema.enum = [false];
  } else if (allowTrue && !allowFalse) {
    schema.enum = [true];
  }
}

function addNumberValidation(schema, validation) {
  if (!validation) return;
  if (validation.minimum !== null) {
    schema.minimum = validation.minimum;
  }
  if (validation.maximum !== null) {
    schema.maximum = validation.maximum;
  }
  if (validation.exclusiveMinimum !== null) {
    schema.exclusiveMinimum = validation.exclusiveMinimum;
  }
  if (validation.exclusiveMaximum !== null) {
    schema.exclusiveMaximum = validation.exclusiveMaximum;
  }
  if (validation.multipleOf !== null) {
    schema.multipleOf = validation.multipleOf;
  }
}

function addArrayValidation(schema, validation) {
  if (!validation) return;
  if (validation.minItems !== null) {
    schema.minItems = validation.minItems;
  }
  if (validation.maxItems !== null) {
    schema.maxItems = validation.maxItems;
  }
  if (validation.uniqueItems) {
    schema.uniqueItems = true;
  }
}

function addObjectValidation(schema, validation) {
  if (!validation) return;
  if (validation.minProperties !== null) {
    schema.minProperties = validation.minProperties;
  }
  if (validation.maxProperties !== null) {
    schema.maxProperties = validation.maxProperties;
  }
  if (validation.additionalProperties !== undefined) {
    schema.additionalProperties = validation.additionalProperties;
  }
}

export default generateJsonSchema;
