import React, { useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { ComponentsPanel } from '@/components/builder/ComponentsPanel';
import { Canvas } from '@/components/builder/Canvas';
import { PropertiesPanel } from '@/components/builder/PropertiesPanel';
import { TopMenu } from '@/components/builder/TopMenu';
import { ComponentType, ComponentInstance } from '@/types/builder';
import { generateId } from '@/lib/utils';

const SiteBuilder = () => {
  const [components, setComponents] = useState<ComponentInstance[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<ComponentInstance | null>(null);
  const [draggedComponent, setDraggedComponent] = useState<ComponentType | ComponentInstance | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    
    // Check if dragging from components panel (ComponentType) or canvas (ComponentInstance)
    if (typeof active.data.current?.component === 'string') {
      setDraggedComponent(active.data.current.component as ComponentType);
    } else {
      setDraggedComponent(active.data.current?.component as ComponentInstance);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setDraggedComponent(null);
      return;
    }

    // Handle dropping from components panel
    if (typeof active.data.current?.component === 'string') {
      const componentType = active.data.current.component as ComponentType;
      const newComponent: ComponentInstance = {
        id: generateId(),
        type: componentType,
        props: getDefaultProps(componentType),
        children: [],
        parentId: over.id === 'canvas' ? null : over.id as string
      };

      setComponents(prev => {
        if (over.id === 'canvas') {
          return [...prev, newComponent];
        } else {
          // Add to specific parent
          return prev.map(comp => 
            comp.id === over.id 
              ? { ...comp, children: [...comp.children, newComponent] }
              : comp
          );
        }
      });
    }

    setDraggedComponent(null);
  };

  const getDefaultProps = (type: ComponentType) => {
    switch (type) {
      case 'button':
        return { text: 'Click me', backgroundColor: '#6366f1', color: '#ffffff' };
      case 'text':
        return { text: 'Your text here', fontSize: '16px', color: '#000000' };
      case 'container':
        return { backgroundColor: '#f8fafc', padding: '20px', minHeight: '100px' };
      case 'image':
        return { src: 'https://via.placeholder.com/300x200', alt: 'Placeholder', width: '300px', height: '200px' };
      case 'slider':
        return { images: ['https://via.placeholder.com/600x300?text=Slide+1', 'https://via.placeholder.com/600x300?text=Slide+2'], autoplay: true };
      default:
        return {};
    }
  };

  const updateComponentProps = (componentId: string, props: any) => {
    setComponents(prev => prev.map(comp =>
      comp.id === componentId 
        ? { ...comp, props: { ...comp.props, ...props } }
        : comp
    ));
    
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(prev => prev ? { ...prev, props: { ...prev.props, ...props } } : null);
    }
  };

  const deleteComponent = (componentId: string) => {
    setComponents(prev => prev.filter(comp => comp.id !== componentId));
    if (selectedComponent?.id === componentId) {
      setSelectedComponent(null);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-background">
        {/* Top Menu */}
        <TopMenu components={components} />
        
        <div className="flex-1 flex">
          {/* Left Panel - Components */}
          <div className="w-80 bg-builder-panel border-r border-builder-panel-border">
            <ComponentsPanel />
          </div>
          
          {/* Main Canvas */}
          <div className="flex-1 bg-builder-canvas">
            <Canvas 
              components={components}
              selectedComponent={selectedComponent}
              onSelectComponent={setSelectedComponent}
            />
          </div>
          
          {/* Right Panel - Properties */}
          <div className="w-80 bg-builder-panel border-l border-builder-panel-border">
            <PropertiesPanel 
              selectedComponent={selectedComponent}
              onUpdateProps={updateComponentProps}
              onDeleteComponent={deleteComponent}
            />
          </div>
        </div>
        
        {/* Drag Overlay */}
        <DragOverlay>
          {draggedComponent ? (
            <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-lg">
              {typeof draggedComponent === 'string' ? draggedComponent : draggedComponent.type}
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default SiteBuilder;