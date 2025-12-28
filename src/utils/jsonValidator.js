import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

// Find line number for a JSON path in the source text
function findLineForPath(jsonText, path) {
  if (!path || path === '(root)') {
    return 1
  }

  // Convert JSON path like "/name" or "/users/0/email" to search pattern
  const parts = path.split('/').filter(Boolean)
  if (parts.length === 0) return 1

  const lines = jsonText.split('\n')

  // For simple paths like "/name", find the key in the JSON
  const lastKey = parts[parts.length - 1]

  // If it's an array index, try to find the parent key
  const keyToFind = /^\d+$/.test(lastKey)
    ? parts[parts.length - 2]
    : lastKey

  if (!keyToFind) return 1

  // Search for the key in the JSON text
  const keyPattern = new RegExp(`"${keyToFind}"\\s*:`)

  for (let i = 0; i < lines.length; i++) {
    if (keyPattern.test(lines[i])) {
      return i + 1 // Line numbers are 1-indexed
    }
  }

  return 1
}

export function validateJson(jsonSchema, jsonData, jsonText = '') {
  try {
    const validate = ajv.compile(jsonSchema)
    const valid = validate(jsonData)

    if (valid) {
      return { valid: true, errors: [] }
    }

    // Format errors for display
    const errors = validate.errors.map(err => {
      const path = err.instancePath || '(root)'
      const line = jsonText ? findLineForPath(jsonText, path) : null

      return {
        path,
        message: `${err.instancePath || 'root'} ${err.message}`,
        keyword: err.keyword,
        params: err.params,
        line,
      }
    })

    return { valid: false, errors }
  } catch (e) {
    return {
      valid: false,
      errors: [{ path: '', message: `Schema error: ${e.message}`, keyword: 'schema', line: null }]
    }
  }
}

export default validateJson
