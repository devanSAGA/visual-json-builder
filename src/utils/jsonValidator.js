import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

export function validateJson(jsonSchema, jsonData) {
  try {
    const validate = ajv.compile(jsonSchema)
    const valid = validate(jsonData)

    if (valid) {
      return { valid: true, errors: [] }
    }

    // Format errors for display
    const errors = validate.errors.map(err => ({
      path: err.instancePath || '(root)',
      message: `${err.instancePath || 'root'} ${err.message}`,
      keyword: err.keyword,
      params: err.params,
    }))

    return { valid: false, errors }
  } catch (e) {
    return {
      valid: false,
      errors: [{ path: '', message: `Schema error: ${e.message}`, keyword: 'schema' }]
    }
  }
}

export default validateJson
