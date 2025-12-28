import { useState, useRef, useEffect } from 'react'

const typeOptions = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'null', label: 'Null' },
]

export default function PropertyRow({ property, onUpdate, onDelete, onEditFull }) {
  const [editingField, setEditingField] = useState(null)
  const [editValue, setEditValue] = useState('')
  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingField])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsTypeDropdownOpen(false)
      }
    }
    if (isTypeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isTypeDropdownOpen])

  const startEditing = (field) => {
    setEditingField(field)
    setEditValue(property[field] || '')
  }

  const saveEdit = () => {
    if (editingField === 'name' && !editValue.trim()) {
      setEditingField(null)
      return
    }
    onUpdate(property.id, { [editingField]: editValue })
    setEditingField(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      saveEdit()
    } else if (e.key === 'Escape') {
      setEditingField(null)
    }
  }

  const handleTypeChange = (newType) => {
    onUpdate(property.id, { type: newType })
    setIsTypeDropdownOpen(false)
  }

  return (
    <div className="group flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 hover:border-gray-300 transition-colors">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Name - inline editable */}
        {editingField === 'name' ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            className="font-medium text-gray-900 px-1 py-0.5 border border-blue-400 rounded outline-none bg-white max-w-[150px]"
          />
        ) : (
          <span
            onClick={() => startEditing('name')}
            className="font-medium text-gray-900 px-1 py-0.5 rounded cursor-pointer truncate max-w-[150px] border border-transparent hover:border-gray-300 transition-colors"
            title={property.name}
          >
            {property.name}
          </span>
        )}

        {/* Description - inline editable */}
        {editingField === 'description' ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
            placeholder="Add description..."
            className="text-sm text-gray-500 px-1 py-0.5 border border-blue-400 rounded outline-none bg-white max-w-[200px]"
          />
        ) : (
          <span
            onClick={() => startEditing('description')}
            className="text-sm text-gray-500 px-1 py-0.5 rounded cursor-pointer truncate max-w-[200px] border border-transparent hover:border-gray-300 transition-colors"
            title={property.description || 'Add description...'}
          >
            {property.description || (
              <span className="text-gray-400 italic">Add description...</span>
            )}
          </span>
        )}

        {/* Type - dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
            className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
          >
            {property.type}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isTypeDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[100px]">
              {typeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleTypeChange(option.value)}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg ${
                    property.type === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Required badge */}
        {property.required && (
          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded flex-shrink-0">
            required
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
        <button
          onClick={() => onEditFull(property)}
          className="text-gray-400 hover:text-blue-500 transition-colors"
          title="Edit all fields"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => onDelete(property.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
          title="Delete property"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  )
}
