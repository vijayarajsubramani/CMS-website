export type ComponentType = 'button' | 'text' | 'container' | 'image' | 'slider';

export interface ComponentInstance {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  children: ComponentInstance[];
  parentId: string | null;
}

export interface ComponentProps {
  text?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  src?: string;
  alt?: string;
  images?: string[];
  autoplay?: boolean;
  minHeight?: string;
}

export interface DragData {
  component: ComponentType | ComponentInstance;
}