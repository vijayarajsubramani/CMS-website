import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ComponentType } from '@/types/builder';
import { MousePointer, Type, Square, Image, ImageIcon } from 'lucide-react';

const componentTypes: { type: ComponentType; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    type: 'button', 
    label: 'Button', 
    icon: <MousePointer className="w-5 h-5" />,
    description: 'Interactive button element'
  },
  { 
    type: 'text', 
    label: 'Text', 
    icon: <Type className="w-5 h-5" />,
    description: 'Text content element'
  },
  { 
    type: 'container', 
    label: 'Container', 
    icon: <Square className="w-5 h-5" />,
    description: 'Layout container for other elements'
  },
  { 
    type: 'image', 
    label: 'Image', 
    icon: <Image className="w-5 h-5" />,
    description: 'Image display element'
  },
  { 
    type: 'slider', 
    label: 'Slider', 
    icon: <ImageIcon className="w-5 h-5" />,
    description: 'Image carousel slider'
  },
];

const DraggableComponent = ({ type, label, icon, description }: { 
  type: ComponentType; 
  label: string; 
  icon: React.ReactNode;
  description: string;
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `component-${type}`,
    data: {
      component: type,
    },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        group flex items-center gap-3 p-4 rounded-lg border transition-builder cursor-grab active:cursor-grabbing
        ${isDragging 
          ? 'opacity-50 scale-105 rotate-2 shadow-lg bg-primary text-primary-foreground border-primary' 
          : 'bg-card hover:bg-secondary border-border hover:border-primary/30 hover:shadow-md'
        }
      `}
    >
      <div className={`
        flex items-center justify-center w-10 h-10 rounded-lg transition-builder
        ${isDragging 
          ? 'bg-primary-light' 
          : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
        }
      `}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm">{label}</h3>
        <p className="text-xs text-muted-foreground group-hover:text-foreground/70">
          {description}
        </p>
      </div>
    </div>
  );
};

export const ComponentsPanel = () => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-builder-panel-border">
        <h2 className="text-lg font-semibold mb-2">Components</h2>
        <p className="text-sm text-muted-foreground">
          Drag components onto the canvas to build your site
        </p>
      </div>
      
      <div className="flex-1 p-6 space-y-3 overflow-y-auto">
        {componentTypes.map((component) => (
          <DraggableComponent
            key={component.type}
            type={component.type}
            label={component.label}
            icon={component.icon}
            description={component.description}
          />
        ))}
      </div>
      
      <div className="p-6 border-t border-builder-panel-border">
        <div className="text-xs text-muted-foreground text-center">
          More components coming soon
        </div>
      </div>
    </div>
  );
};