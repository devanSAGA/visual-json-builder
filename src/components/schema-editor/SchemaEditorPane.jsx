import { Tabs } from '../ui'
import VisualBuilder from './VisualBuilder'
import SchemaCodeEditor from './SchemaCodeEditor'

export default function SchemaEditorPane() {
  const tabs = [
    {
      id: 'visual',
      label: 'Visual',
      content: <VisualBuilder />,
    },
    {
      id: 'code',
      label: 'Code',
      content: <SchemaCodeEditor />,
    },
  ]

  return (
    <div className="h-full bg-white">
      <Tabs tabs={tabs} defaultTab="visual" />
    </div>
  )
}
