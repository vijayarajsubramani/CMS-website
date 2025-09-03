import React from 'react';
import { ComponentInstance } from '@/types/builder';
import { useDroppable } from '@dnd-kit/core';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

interface RenderComponentProps {
  component: ComponentInstance;
  isSelected: boolean;
  onSelect: () => void;
}

export const RenderComponent = ({ component, isSelected, onSelect }: RenderComponentProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: component.id,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect();
  };

  const renderContent = () => {
    switch (component.type) {
      case 'button':
        return (
          <button
            style={{
              backgroundColor: component.props.backgroundColor || '#6366f1',
              color: component.props.color || '#ffffff',
              padding: component.props.padding || '12px 24px',
              margin: component.props.margin || '0',
              fontSize: component.props.fontSize || '14px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            {component.props.text || 'Button'}
          </button>
        );

      case 'text':
        return (
          <div
            style={{
              fontSize: component.props.fontSize || '16px',
              color: component.props.color || '#000000',
              padding: component.props.padding || '0',
              margin: component.props.margin || '0',
              lineHeight: '1.5',
            }}
          >
            {component.props.text || 'Your text here'}
          </div>
        );

      case 'container':
        return (
          <div
            ref={component.type === 'container' ? setNodeRef : undefined}
            style={{
              backgroundColor: component.props.backgroundColor || '#f8fafc',
              padding: component.props.padding || '20px',
              margin: component.props.margin || '0',
              minHeight: component.props.minHeight || '100px',
              borderRadius: '8px',
              border: isOver ? '2px dashed #6366f1' : '2px dashed transparent',
            }}
            className={`transition-builder ${isOver ? 'bg-drop-zone-active' : ''}`}
          >
            {component.children.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Drop components here
              </div>
            ) : (
              <div className="space-y-4">
                {component.children.map((child) => (
                  <RenderComponent
                    key={child.id}
                    component={child}
                    isSelected={false}
                    onSelect={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <img
            src={component.props.src || 'https://via.placeholder.com/300x200'}
            alt={component.props.alt || 'Image'}
            style={{
              width: component.props.width || '300px',
              height: component.props.height || '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              margin: component.props.margin || '0',
            }}
          />
        );

      case 'slider':
        return (
          <div style={{ width: '100%', maxWidth: '600px', margin: component.props.margin || '0' }}>
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              navigation={true}
              autoplay={component.props.autoplay ? { delay: 3000 } : false}
              style={{ borderRadius: '8px', overflow: 'hidden' }}
            >
              {(component.props.images || []).map((image: string, index: number) => (
                <SwiperSlide key={index}>
                  <img
                    src={image}
                    alt={`Slide ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '300px',
                      objectFit: 'cover',
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        );

      default:
        return <div>Unknown component type</div>;
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        transition-builder cursor-pointer
        ${isSelected ? 'component-selected' : 'hover:component-hover'}
      `}
    >
      {renderContent()}
    </div>
  );
};