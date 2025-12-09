import React, { useRef, useState } from 'react';
import { Tv } from 'lucide-react';
import { TV } from '../hooks/useTVs';

interface TVIconProps {
  tv: TV;
  onSelect: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDrag: (tvId: string, deltaX: number, deltaY: number) => void;
  isDragging: boolean;
}

export function TVIcon({
  tv,
  onSelect,
  onDragStart,
  onDragEnd,
  onDrag,
  isDragging
}: TVIconProps) {
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'text-purple-600 bg-purple-100';
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
    onDrag(tv.id, deltaX, deltaY);
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
        left: `${tv.x_position}%`,
        top: `${tv.y_position}%`,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        if (!isDragging) onSelect();
      }}
    >
      <div className={`relative p-1.5 rounded-full border-2 border-white shadow-lg ${getStatusColor(tv.status)} ${
        isDragging ? 'shadow-xl' : ''
      }`}>
        <Tv className="h-4 w-4" />
        
        {/* Status indicator */}
        <div
          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white ${
            tv.status.toLowerCase() === 'online' ? 'bg-green-500' :
            tv.status.toLowerCase() === 'offline' ? 'bg-red-500' :
            tv.status.toLowerCase() === 'warning' ? 'bg-yellow-500' :
            'bg-gray-500'
          }`}
        />
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {tv.name}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
      </div>
    </div>
  );
}