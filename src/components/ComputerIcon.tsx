import React, { useRef, useState } from 'react';
import { Monitor } from 'lucide-react';
import { Computer } from '../hooks/useComputers';

interface ComputerIconProps {
  computer: Computer;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrag: (computerId: string, deltaX: number, deltaY: number) => void;
  isDragging: boolean;
}

export function ComputerIcon({
  computer,
  onSelect,
  onDragStart,
  onDragEnd,
  onDrag,
  isDragging
}: ComputerIconProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'text-blue-600 bg-blue-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDragStart();
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!dragStart) return;
    
    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;
    onDrag(computer.id, deltaX, deltaY);
    setDragStart({ x: event.clientX, y: event.clientY });
  };

  const handleMouseUp = () => {
    if (dragStart) {
      onDragEnd();
      setDragStart(null);
    }
  };

  React.useEffect(() => {
    if (dragStart) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragStart]);

  return (
    <div
      ref={iconRef}
      className={`absolute group cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform ${
        isDragging ? 'scale-110 z-50' : 'hover:scale-105'
      }`}
      style={{
        left: `${computer.x_position}%`,
        top: `${computer.y_position}%`,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging) onSelect();
      }}
    >
      <div className={`relative p-0.5 rounded-full border-2 border-white shadow-lg ${getStatusColor(computer.status)} ${
        isDragging ? 'shadow-xl' : ''
      }`}>
        <Monitor className="h-1 w-1" />
      </div>
        

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {computer.name}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}