import { useState, useEffect, useCallback, useRef, useImperativeHandle, forwardRef } from 'react'
import Editor from '@monaco-editor/react'
import useSchemaStore from '../../store/useSchemaStore'
import { generateJsonSchema } from '../../utils/schemaGenerator'
import { parseJsonSchema } from '../../utils/schemaParser'
import { prettifyJson } from '../../utils/jsonFormatter'
import useDebounce from '../../hooks/useDebounce'

const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
  lineNumbers: 'on',
  scrollBeyondLastLine: false,
  automaticLayout: true,
  tabSize: 2,
  largeFileOptimizations: true,
  folding: true,
}

const SchemaCodeEditor = forwardRef(function SchemaCodeEditor(props, ref) {
  const { schema, setSchema } = useSchemaStore()
  const [editorValue, setEditorValue] = useState('')
  const [parseError, setParseError] = useState(null)
  const isInternalUpdate = useRef(false)

  useImperativeHandle(ref, () => ({
    prettify: () => {
      const { success, result } = prettifyJson(editorValue)
      if (success) {
        setEditorValue(result)
      }
    }
  }))

  // Generate JSON Schema from store
  const jsonSchema = generateJsonSchema(schema)
  const jsonSchemaString = JSON.stringify(jsonSchema, null, 2)

  // Sync editor value when store changes (from visual editor)
  useEffect(() => {
    if (!isInternalUpdate.current) {
      // Use setTimeout to avoid sync setState in effect
      setTimeout(() => {
        setEditorValue(jsonSchemaString)
        setParseError(null)
      }, 0)
    }
    isInternalUpdate.current = false
  }, [jsonSchemaString])

  // Debounced handler to parse and update store
  const updateStore = useCallback(
    (value) => {
      try {
        const parsed = JSON.parse(value)
        const internalSchema = parseJsonSchema(parsed)
        isInternalUpdate.current = true
        setSchema(internalSchema)
        setParseError(null)
      } catch (e) {
        setParseError(e.message)
      }
    },
    [setSchema]
  )

  const debouncedUpdateStore = useDebounce(updateStore, 500)

  const handleEditorChange = (value) => {
    setEditorValue(value)
    debouncedUpdateStore(value)
  }

  return (
    <div className="h-full flex flex-col">
      {parseError && (
        <div className="px-3 py-2 bg-red-50 border-b border-red-200 text-red-700 text-sm">
          {parseError}
        </div>
      )}
      <div className="flex-1">
        <Editor
          height="100%"
          language="json"
          value={editorValue}
          onChange={handleEditorChange}
          options={EDITOR_OPTIONS}
        />
      </div>
    </div>
  )
})

export default SchemaCodeEditor
