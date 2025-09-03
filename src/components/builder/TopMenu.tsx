import React from 'react';
import { ComponentInstance } from '@/types/builder';
import { Button } from '@/components/ui/button';
import { Download, Play, Undo, Redo, Save } from 'lucide-react';
import JSZip from 'jszip';

interface TopMenuProps {
  components: ComponentInstance[];
}

export const TopMenu = ({ components }: TopMenuProps) => {
  const generateHTML = () => {
    const renderComponent = (component: ComponentInstance): string => {
      switch (component.type) {
        case 'button':
          return `
            <button style="background-color: ${component.props.backgroundColor || '#6366f1'}; color: ${component.props.color || '#ffffff'}; padding: ${component.props.padding || '12px 24px'}; margin: ${component.props.margin || '0'}; font-size: ${component.props.fontSize || '14px'}; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;">
              ${component.props.text || 'Button'}
            </button>
          `;
        
        case 'text':
          return `
            <div style="font-size: ${component.props.fontSize || '16px'}; color: ${component.props.color || '#000000'}; padding: ${component.props.padding || '0'}; margin: ${component.props.margin || '0'}; line-height: 1.5;">
              ${component.props.text || 'Your text here'}
            </div>
          `;
        
        case 'container':
          const childrenHTML = component.children.map(child => renderComponent(child)).join('\n');
          return `
            <div style="background-color: ${component.props.backgroundColor || '#f8fafc'}; padding: ${component.props.padding || '20px'}; margin: ${component.props.margin || '0'}; min-height: ${component.props.minHeight || '100px'}; border-radius: 8px;">
              ${childrenHTML || '<div style="text-align: center; color: #6b7280; padding: 2rem;">Empty container</div>'}
            </div>
          `;
        
        case 'image':
          return `
            <img src="${component.props.src || 'https://via.placeholder.com/300x200'}" alt="${component.props.alt || 'Image'}" style="width: ${component.props.width || '300px'}; height: ${component.props.height || '200px'}; object-fit: cover; border-radius: 8px; margin: ${component.props.margin || '0'};" />
          `;
        
        case 'slider':
          const images = component.props.images || [];
          return `
            <div class="slider" style="width: 100%; max-width: 600px; margin: ${component.props.margin || '0'}; position: relative; overflow: hidden; border-radius: 8px;">
              <div class="slider-container" style="display: flex; transition: transform 0.3s ease;">
                ${images.map((image: string, index: number) => `
                  <img src="${image}" alt="Slide ${index + 1}" style="width: 100%; height: 300px; object-fit: cover; flex-shrink: 0;" />
                `).join('')}
              </div>
              <button class="slider-prev" style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 10px; border-radius: 50%; cursor: pointer;">‹</button>
              <button class="slider-next" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 10px; border-radius: 50%; cursor: pointer;">›</button>
              <div class="slider-dots" style="text-align: center; margin-top: 10px;">
                ${images.map((_: any, index: number) => `
                  <span class="slider-dot" data-slide="${index}" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ccc; margin: 0 5px; cursor: pointer;"></span>
                `).join('')}
              </div>
            </div>
          `;
        
        default:
          return '';
      }
    };

    const componentsHTML = components.map(component => renderComponent(component)).join('\n\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        ${componentsHTML}
    </div>
    <script src="script.js"></script>
</body>
</html>`;
  };

  const generateCSS = () => {
    return `/* Generated Website Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    line-height: 1.6;
    color: #333;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

/* Slider Styles */
.slider {
    position: relative;
    overflow: hidden;
}

.slider-container {
    display: flex;
    transition: transform 0.3s ease;
}

.slider img {
    width: 100%;
    flex-shrink: 0;
}

.slider-prev,
.slider-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    z-index: 1;
}

.slider-prev {
    left: 10px;
}

.slider-next {
    right: 10px;
}

.slider-prev:hover,
.slider-next:hover {
    background: rgba(0, 0, 0, 0.7);
}

.slider-dots {
    text-align: center;
    margin-top: 15px;
}

.slider-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #ccc;
    margin: 0 5px;
    cursor: pointer;
    transition: background 0.3s ease;
}

.slider-dot.active {
    background: #333;
}

/* Responsive Design */
@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
    
    .slider {
        max-width: 100%;
    }
}`;
  };

  const generateJS = () => {
    return `// Generated Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all sliders
    const sliders = document.querySelectorAll('.slider');
    
    sliders.forEach(function(slider) {
        initSlider(slider);
    });
});

function initSlider(slider) {
    const container = slider.querySelector('.slider-container');
    const images = slider.querySelectorAll('.slider-container img');
    const prevBtn = slider.querySelector('.slider-prev');
    const nextBtn = slider.querySelector('.slider-next');
    const dots = slider.querySelectorAll('.slider-dot');
    
    let currentIndex = 0;
    const totalSlides = images.length;
    
    if (totalSlides === 0) return;
    
    // Update slider position
    function updateSlider() {
        const translateX = -currentIndex * 100;
        container.style.transform = 'translateX(' + translateX + '%)';
        
        // Update dots
        dots.forEach(function(dot, index) {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlider();
    }
    
    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlider();
    }
    
    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }
    
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });
    
    // Auto-play (if needed)
    // Uncomment the following lines to enable auto-play
    /*
    setInterval(function() {
        nextSlide();
    }, 5000);
    */
    
    // Initialize
    updateSlider();
}`;
  };

  const handleExport = async () => {
    const zip = new JSZip();
    
    // Generate files
    const html = generateHTML();
    const css = generateCSS();
    const js = generateJS();
    
    // Add files to zip
    zip.file('index.html', html);
    zip.file('styles.css', css);
    zip.file('script.js', js);
    
    // Generate and download zip
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-14 bg-builder-panel border-b border-builder-panel-border flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">Site Builder</h1>
        <div className="text-sm text-muted-foreground">
          {components.length} component{components.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled>
          <Undo className="w-4 h-4 mr-2" />
          Undo
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Redo className="w-4 h-4 mr-2" />
          Redo
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm" disabled>
          <Play className="w-4 h-4 mr-2" />
          Preview
        </Button>
        <Button onClick={handleExport} className="bg-primary hover:bg-primary-hover">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};