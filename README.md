# Visual JSON Schema Builder

A visual editor for defining JSON schemas and validating JSON input against them. The application consists of three main components:

1. **Visual Editor** — Define and edit JSON schemas through an intuitive UI
2. **Code Editor** — Define and edit JSON schemas directly in code
3. **Validator** — Validate input JSON against the defined schema

## Screenshots

<img width="1911" height="902" alt="image" src="https://github.com/user-attachments/assets/1c4ee295-286e-4396-b63d-b68e5b9c3b03" />
<img width="1907" height="901" alt="image" src="https://github.com/user-attachments/assets/e9bf4b7e-2c04-4a51-8ada-15fee39c5dab" />
<img width="1915" height="903" alt="image" src="https://github.com/user-attachments/assets/dfe35b03-e721-453c-b75a-7fb025e8fb58" />

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

- Visual editor to define JSON schemas using UI
- Live preview of formatted JSON schema that stays in sync with the visual editor
- Support for **Text**, **Number**, **Boolean**, **Object**, **Array**, and **Null** property types
- Support for some validation rules based on the property type
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
- Changing a property type from object to another type shows a confirmation modal warning about nested property data loss

### JSON Schema Editor

- Clear schema button to reset the schema, with a confirmation modal to prevent accidental data loss

### Validator

- The validator panel is open by default so first-time users can discover it easily
- The validator panel's open/close state persists across sessions via local storage
- Validation runs after a debounce period when the user stops typing
- Success or error messages appear at the bottom to prevent layout shifts. A "Valid" or "Invalid" badge also appears for quick interpretation
- Error messages indicate the line number of the issue. Clicking an error highlights the faulty line briefly and moves the cursor there
- Auto-suggestions based on the defined schema make editing easier

### Pending Improvements

- Persist JSON schema across sessions
- "Fix All" button to automatically correct input JSON errors based on the schema
- "Generate Sample" button to create sample input JSON matching the schema
- Support for advanced Draft-07 features (`$ref` and multi-schema bundles)
- Make UI mobile responsive
