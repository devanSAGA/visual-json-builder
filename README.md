# Visual JSON Schema Builder

A visual editor for defining JSON schemas and validating JSON input against them. The application consists of three main components:

1. **Visual Editor** — Define and edit JSON schemas through an intuitive UI
2. **Code Editor** — Define and edit JSON schemas directly in code
3. **Validator** — Validate input JSON against the defined schema

## Tech Stack

- **React** — UI framework
- **Tailwind CSS** — Styling
- **Zustand** — State management
- **@monaco-editor/react** — Code editor component
- **AJV** — JSON Schema validation
- **@tanstack/virtual** — Virtualization in Visual Editor for large schemas
- **lucide-react** — Icons

## Installation

```bash
# Clone the repository
git clone https://github.com/user/visual-json-builder.git
cd visual-json-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

## Features

- Visual editor to define JSON schemas using a drag-and-drop UI
- Live preview of formatted JSON schema that stays in sync with the visual editor
- Support for **Text**, **Number**, **Boolean**, **Object**, **Array**, and **Null** property types
- Virtualization in the visual editor to handle large JSON schemas efficiently
- Collapsible validator panel for validating JSON input against the schema
- Copy to clipboard functionality for both JSON schema and input JSON
- Prettify functionality for JSON schema and input JSON
- One-click download option for the JSON schema
- Nested objects supported
- Auto-suggestions in the input JSON editor based on the defined schema
- Clear, actionable error messages in the validator
- Syntax highlighting in both the schema editor and input JSON editor

## Design Decisions

### General

- The app loads with sample data showcasing various property types, allowing users to explore features straught away
- A single primary CTA for adding properties ensures easy discoverability
- All icon buttons include tooltips explaining their function
- The visual editor and schema code editor are resizable via a middle divider, which is helpful when working with nested schemas

### Visual Editor

- Inline editing is enabled for property name, description, and type for quick changes
- Edit and delete icons appear only on hover to reduce visual clutter
- Required properties are marked with a red "Required" badge
- Nested object properties are displayed with indentation for better visual hierarchy
- The property creation modal is kept minimal — only the property name is required, and it's automatically focused for immediate typing. The modal closes on Enter, Escape, or clicking outside

### Validator

- The validator panel is open by default so first-time users can discover it easily
- Validation runs after a debounce period when the user stops typing
- Success or error messages appear at the bottom to prevent layout shifts. A "Valid" or "Invalid" badge also appears for quick interpretation
- Error messages indicate the line number of the issue. Clicking an error highlights the faulty line briefly and moves the cursor there
- Auto-suggestions based on the defined schema make editing easier
