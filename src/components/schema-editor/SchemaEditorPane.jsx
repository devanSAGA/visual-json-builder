import { ResizablePanes } from '../ui'
import VisualBuilder from './VisualBuilder'
import SchemaCodeEditor from './SchemaCodeEditor'

export default function SchemaEditorPane() {
  return (
    <ResizablePanes
      leftPane={<VisualBuilder />}
      rightPane={<SchemaCodeEditor />}
      leftTitle="Visual Editor"
      rightTitle="JSON Schema"
      defaultLeftWidth={50}
      minLeftWidth={25}
      maxLeftWidth={75}
    />
  )
}
