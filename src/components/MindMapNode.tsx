import { useRef, useEffect, useState } from 'react';
import type { MindMapNode as MindMapNodeType } from '../types/mindmap';
import { Plus } from 'lucide-react';

interface MindMapNodeProps {
  node: MindMapNodeType;
  isSelected: boolean;
  isEditing: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onEditComplete: () => void;
  onTextChange: (text: string) => void;
  onPositionChange: (x: number, y: number) => void;
  onAddChild: () => void;
}

export function MindMapNode({
  node,
  isSelected,
  isEditing,
  onSelect,
  onEdit,
  onEditComplete,
  onTextChange,
  onPositionChange,
  onAddChild
}: MindMapNodeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditing) return;
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    });
    onSelect();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        onPositionChange(newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, onPositionChange]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onEditComplete();
    } else if (e.key === 'Escape') {
      onEditComplete();
    }
  };

  const handleBlur = () => {
    onEditComplete();
  };

  return (
    <div
      ref={nodeRef}
      className="absolute"
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        transform: 'translate(-50%, -50%)',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isSelected ? 10 : 1
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className="relative px-6 py-3 rounded-full shadow-lg transition-all duration-200 min-w-[120px] text-center"
        style={{
          backgroundColor: node.color,
          boxShadow: isSelected 
            ? `0 0 0 3px white, 0 0 0 5px ${node.color}` 
            : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          transform: isSelected ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={node.text}
            onChange={(e) => onTextChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="bg-transparent outline-none text-white text-center w-full placeholder-white/70"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="text-white select-none">
            {node.text}
          </div>
        )}

        {isSelected && !isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddChild();
            }}
            className="absolute -right-2 -bottom-2 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ color: node.color }}
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
