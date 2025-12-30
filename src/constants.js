export const DEFAULT_JSON_SCHEMA = {
  schema: {
    title: "",
    description: "",
    properties: [
      {
        id: "default-1",
        name: "Name",
        type: "text",
        description: "",
        required: false,
        validation: {
          minLength: null,
          maxLength: null,
          pattern: null,
          format: null,
        },
      },
      {
        id: "default-2",
        name: "Phone",
        type: "number",
        description: "",
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
  jsonInput: "",
  validationErrors: [],
};
