import Editor from '@monaco-editor/react'
import useSchemaStore from '../../store/useSchemaStore'
import { generateJsonSchema } from '../../utils/schemaGenerator'

export default function SchemaCodeEditor() {
  const { schema } = useSchemaStore()
  const jsonSchema = generateJsonSchema(schema)

  return (
    <div className="h-full">
      <Editor
        height="100%"
        language="json"
        value={JSON.stringify(jsonSchema, null, 2)}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          readOnly: true,
        }}
      />
    </div>
  )
}
