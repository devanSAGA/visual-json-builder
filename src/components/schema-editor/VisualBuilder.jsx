import { useState, useCallback, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Button, Modal, HelperMessage } from "../ui";
import PropertyForm from "./PropertyForm";
import PropertyRow from "./PropertyRow";
import useSchemaStore from "../../store/useSchemaStore";

const ROW_HEIGHT = 60;
const LIST_HEIGHT = 400;
const VIRTUALIZATION_THRESHOLD = 20;

function VirtualizedList({ properties, onUpdate, onDelete, onEditFull }) {
  const parentRef = useRef(null);
  const rowVirtualizer = useVirtualizer({
    count: properties.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="mt-4 overflow-auto"
      style={{ height: LIST_HEIGHT }}
    >
      <div
        className="w-full relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const property = properties[virtualItem.index];
          return (
            <div
              key={property.id}
              className="absolute top-0 left-0 w-full"
              style={{
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="pb-2">
                <PropertyRow
                  property={property}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                  onEditFull={onEditFull}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function VisualBuilder() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [nestedParentId, setNestedParentId] = useState(null);
  const [isArrayItemAdd, setIsArrayItemAdd] = useState(false);
  const { schema, addProperty, updateProperty, deleteProperty } =
    useSchemaStore();

  const handleAddProperty = (formData) => {
    addProperty(formData, nestedParentId, isArrayItemAdd);
    setIsModalOpen(false);
    setNestedParentId(null);
    setIsArrayItemAdd(false);
  };

  const handleEditProperty = (formData) => {
    updateProperty(editingProperty.id, formData);
    setEditingProperty(null);
  };

  const openEditModal = useCallback((property) => {
    setEditingProperty(property);
  }, []);

  const handleAddNested = useCallback((parentId, isArrayItem = false) => {
    setNestedParentId(parentId);
    setIsArrayItemAdd(isArrayItem);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNestedParentId(null);
    setIsArrayItemAdd(false);
  };

  // Check if any property has nested types (object or array)
  const hasNestedTypes = schema.properties.some(
    (p) => p.type === "object" || p.type === "array"
  );

  // Disable virtualization when there are nested types (variable row heights)
  const shouldVirtualize =
    !hasNestedTypes && schema.properties.length >= VIRTUALIZATION_THRESHOLD;

  return (
    <div className="p-4 h-full overflow-auto">
      <Button onClick={() => setIsModalOpen(true)}>+ Add Property</Button>

      {schema.properties.length === 0 ? (
        <HelperMessage className="mt-4">
          No properties defined yet. Click "Add Property" to get started.
        </HelperMessage>
      ) : shouldVirtualize ? (
        <VirtualizedList
          properties={schema.properties}
          onUpdate={updateProperty}
          onDelete={deleteProperty}
          onEditFull={openEditModal}
        />
      ) : (
        <div className="mt-4 space-y-2">
          {schema.properties.map((property) => (
            <PropertyRow
              key={property.id}
              property={property}
              onUpdate={updateProperty}
              onDelete={deleteProperty}
              onEditFull={openEditModal}
              onAddNested={handleAddNested}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={nestedParentId ? "Add Nested Property" : "Add Property"}
        size="xl"
      >
        <PropertyForm
          onSubmit={handleAddProperty}
          onCancel={handleCloseModal}
        />
      </Modal>

      <Modal
        isOpen={editingProperty !== null}
        onClose={() => setEditingProperty(null)}
        title="Edit Property"
        size="xl"
      >
        <PropertyForm
          initialValues={editingProperty}
          onSubmit={handleEditProperty}
          onCancel={() => setEditingProperty(null)}
        />
      </Modal>
    </div>
  );
}
