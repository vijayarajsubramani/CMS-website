import React from 'react';
import { ComponentInstance } from '@/types/builder';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Trash2, Settings } from 'lucide-react';

interface PropertiesPanelProps {
  selectedComponent: ComponentInstance | null;
  onUpdateProps: (componentId: string, props: any) => void;
  onDeleteComponent: (componentId: string) => void;
}

export const PropertiesPanel = ({ 
  selectedComponent, 
  onUpdateProps, 
  onDeleteComponent 
}: PropertiesPanelProps) => {
  if (!selectedComponent) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-builder-panel-border">
          <h2 className="text-lg font-semibold mb-2">Properties</h2>
          <p className="text-sm text-muted-foreground">
            Select a component to edit its properties
          </p>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <Settings className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              No component selected
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    onUpdateProps(selectedComponent.id, { [key]: value });
  };

  const renderPropertyInputs = () => {
    const { type, props } = selectedComponent;

    switch (type) {
      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Button Text</Label>
              <Input
                id="text"
                value={props.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                placeholder="Button text"
              />
            </div>
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={props.backgroundColor || '#6366f1'}
                onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="color">Text Color</Label>
              <Input
                id="color"
                type="color"
                value={props.color || '#ffffff'}
                onChange={(e) => handlePropChange('color', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fontSize">Font Size</Label>
              <Input
                id="fontSize"
                value={props.fontSize || '14px'}
                onChange={(e) => handlePropChange('fontSize', e.target.value)}
                placeholder="14px"
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text Content</Label>
              <Input
                id="text"
                value={props.text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                placeholder="Your text here"
              />
            </div>
            <div>
              <Label htmlFor="fontSize">Font Size</Label>
              <Input
                id="fontSize"
                value={props.fontSize || '16px'}
                onChange={(e) => handlePropChange('fontSize', e.target.value)}
                placeholder="16px"
              />
            </div>
            <div>
              <Label htmlFor="color">Text Color</Label>
              <Input
                id="color"
                type="color"
                value={props.color || '#000000'}
                onChange={(e) => handlePropChange('color', e.target.value)}
              />
            </div>
          </div>
        );

      case 'container':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="backgroundColor">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={props.backgroundColor || '#f8fafc'}
                onChange={(e) => handlePropChange('backgroundColor', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="padding">Padding</Label>
              <Input
                id="padding"
                value={props.padding || '20px'}
                onChange={(e) => handlePropChange('padding', e.target.value)}
                placeholder="20px"
              />
            </div>
            <div>
              <Label htmlFor="minHeight">Min Height</Label>
              <Input
                id="minHeight"
                value={props.minHeight || '100px'}
                onChange={(e) => handlePropChange('minHeight', e.target.value)}
                placeholder="100px"
              />
            </div>
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                value={props.src || ''}
                onChange={(e) => handlePropChange('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={props.alt || ''}
                onChange={(e) => handlePropChange('alt', e.target.value)}
                placeholder="Image description"
              />
            </div>
            <div>
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                value={props.width || '300px'}
                onChange={(e) => handlePropChange('width', e.target.value)}
                placeholder="300px"
              />
            </div>
            <div>
              <Label htmlFor="height">Height</Label>
              <Input
                id="height"
                value={props.height || '200px'}
                onChange={(e) => handlePropChange('height', e.target.value)}
                placeholder="200px"
              />
            </div>
          </div>
        );

      case 'slider':
        return (
          <div className="space-y-4">
            <div>
              <Label>Slider Images</Label>
              <div className="space-y-2">
                {(props.images || []).map((image: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={image}
                      onChange={(e) => {
                        const newImages = [...(props.images || [])];
                        newImages[index] = e.target.value;
                        handlePropChange('images', newImages);
                      }}
                      placeholder="Image URL"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newImages = (props.images || []).filter((_: any, i: number) => i !== index);
                        handlePropChange('images', newImages);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newImages = [...(props.images || []), 'https://via.placeholder.com/600x300'];
                    handlePropChange('images', newImages);
                  }}
                >
                  Add Image
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="autoplay"
                checked={props.autoplay || false}
                onChange={(e) => handlePropChange('autoplay', e.target.checked)}
              />
              <Label htmlFor="autoplay">Autoplay</Label>
            </div>
          </div>
        );

      default:
        return <div>No properties available</div>;
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-builder-panel-border">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Properties</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDeleteComponent(selectedComponent.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          {selectedComponent.type} component
        </p>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {renderPropertyInputs()}
        
        <Separator className="my-6" />
        
        {/* Common properties for all components */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Layout</h3>
          <div>
            <Label htmlFor="margin">Margin</Label>
            <Input
              id="margin"
              value={selectedComponent.props.margin || '0'}
              onChange={(e) => handlePropChange('margin', e.target.value)}
              placeholder="0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};