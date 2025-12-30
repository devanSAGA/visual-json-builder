export const DEFAULT_JSON_SCHEMA = {
  schema: {
    title: "",
    description: "",
    properties: [
      {
        id: "default-1",
        name: "title",
        type: "text",
        description: "Job posting title",
        required: false,
        validation: {
          minLength: null,
          maxLength: null,
          pattern: null,
          enum: [],
        },
      },
      {
        id: "default-2",
        name: "salary",
        type: "number",
        description: "Annual salary in USD",
        required: false,
        validation: {
          minimum: null,
          maximum: null,
          multipleOf: null,
        },
      },
      {
        id: "default-3",
        name: "isRemote",
        type: "boolean",
        description: "Whether the position is remote",
        required: false,
        validation: {
          allowTrue: true,
          allowFalse: true,
        },
      },
      {
        id: "default-4",
        name: "location",
        type: "object",
        description: "Office location details",
        required: false,
        validation: {},
        properties: [
          {
            id: "default-4-1",
            name: "city",
            type: "text",
            description: "City name",
            required: false,
            validation: {
              minLength: null,
              maxLength: null,
              pattern: null,
              enum: [],
            },
          },
          {
            id: "default-4-2",
            name: "country",
            type: "text",
            description: "Country name",
            required: false,
            validation: {
              minLength: null,
              maxLength: null,
              pattern: null,
              enum: [],
            },
          },
        ],
      },
    ],
  },
  jsonInput: "",
  validationErrors: [],
};
