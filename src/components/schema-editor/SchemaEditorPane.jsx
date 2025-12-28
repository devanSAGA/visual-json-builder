import { useState, useRef } from 'react'
import { Copy, Download, Check, Wand2 } from 'lucide-react'
import { ResizablePanes } from '../ui'
import VisualBuilder from './VisualBuilder'
import SchemaCodeEditor from './SchemaCodeEditor'
import useSchemaStore from '../../store/useSchemaStore'
import { generateJsonSchema } from '../../utils/schemaGenerator'

export default function SchemaEditorPane() {
  const [copied, setCopied] = useState(false)
  const { schema } = useSchemaStore()
  const editorRef = useRef(null)

  const getSchemaJson = () => {
    const jsonSchema = generateJsonSchema(schema)
    return JSON.stringify(jsonSchema, null, 2)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getSchemaJson())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const schemaJson = getSchemaJson()
    const blob = new Blob([schemaJson], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = schema.title ? `${schema.title.toLowerCase().replace(/\s+/g, '-')}-schema.json` : 'schema.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrettify = () => {
    editorRef.current?.prettify()
  }

  const schemaActions = (
    <>
      <button
        onClick={handlePrettify}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Prettify JSON"
      >
        <Wand2 size={16} />
      </button>
      <button
        onClick={handleCopy}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Copy to clipboard"
      >
        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      </button>
      <button
        onClick={handleDownload}
        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
        title="Download schema"
      >
        <Download size={16} />
      </button>
    </>
  )

  return (
    <ResizablePanes
      leftPane={<VisualBuilder />}
      rightPane={<SchemaCodeEditor ref={editorRef} />}
      leftTitle="Visual Editor"
      rightTitle="JSON Schema"
      rightActions={schemaActions}
      defaultLeftWidth={50}
      minLeftWidth={25}
      maxLeftWidth={75}
    />
  )
}
