import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ComponentInstance } from '@/types/builder';
import { RenderComponent } from './RenderComponent';
import { Plus } from 'lucide-react';

interface CanvasProps {
  components: ComponentInstance[];
  selectedComponent: ComponentInstance | null;
  onSelectComponent: (component: ComponentInstance | null) => void;
}

export const Canvas = ({ components, selectedComponent, onSelectComponent }: CanvasProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas',
  });

  const isEmpty = components.length === 0;

  return (
    <div className="h-full flex flex-col">
      {/* Canvas Header */}
      <div className="px-6 py-4 border-b border-builder-panel-border bg-builder-panel">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Canvas</h2>
            <p className="text-sm text-muted-foreground">
              Drop components here to build your website
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {components.length} component{components.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={setNodeRef}
        className={`
          flex-1 relative overflow-auto transition-builder
          ${isOver ? 'bg-drop-zone-active' : 'bg-builder-canvas builder-grid'}
        `}
      >
        {isEmpty ? (
          <div className={`
            absolute inset-0 flex items-center justify-center transition-builder
            ${isOver ? 'scale-105' : ''}
          `}>
            <div className="text-center max-w-md mx-auto p-8">
              <div className={`
                w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-builder
                ${isOver 
                  ? 'bg-primary text-primary-foreground scale-110' 
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                {isOver ? 'Drop your component here!' : 'Start building your website'}
              </h3>
              <p className="text-muted-foreground">
                {isOver 
                  ? 'Release to add the component to your canvas'
                  : 'Drag components from the left panel to get started'
                }
              </p>
            </div>
          </div>
        ) : (
          <div className="p-6 space-y-4">
            {components.map((component) => (
              <RenderComponent
                key={component.id}
                component={component}
                isSelected={selectedComponent?.id === component.id}
                onSelect={() => onSelectComponent(component)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};