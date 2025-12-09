import React, { useRef, useState } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FloorPlan, Printer } from '../lib/supabase';
import { Computer } from '../hooks/useComputers';
import { TV } from '../hooks/useTVs';
import { PrinterIcon } from './PrinterIcon';
import { ComputerIcon } from './ComputerIcon';
import { TVIcon } from './TVIcon';
import { PrinterModal } from './PrinterModal';
import { ComputerModal } from './ComputerModal';
import { TVModal } from './TVModal';

interface FloorPlanCanvasProps {
  floorPlan: FloorPlan;
  printers: Printer[];
  computers: Computer[];
  tvs: TV[];
  onAddPrinter: (x: number, y: number) => void;
  onAddComputer: (x: number, y: number) => void;
  onAddTV: (x: number, y: number) => void;
  onUpdatePrinter: (printer: Printer) => void;
  onUpdateComputer: (computer: Computer) => void;
  onUpdateTV: (tv: TV) => void;
  onDeletePrinter: (id: string) => void;
  onDeleteComputer: (id: string) => void;
  onDeleteTV: (id: string) => void;
  deviceMode: 'printers' | 'computers' | 'tvs';
}

export function FloorPlanCanvas({
  floorPlan,
  printers,
  computers,
  tvs,
  onAddPrinter,
  onAddComputer,
  onAddTV,
  onUpdatePrinter,
  onUpdateComputer,
  onUpdateTV,
  onDeletePrinter,
  onDeleteComputer,
  onDeleteTV,
  deviceMode
}: FloorPlanCanvasProps) {
  const [selectedPrinter, setSelectedPrinter] = useState<Printer | null>(null);
  const [selectedComputer, setSelectedComputer] = useState<Computer | null>(null);
  const [selectedTV, setSelectedTV] = useState<TV | null>(null);
  const [draggedPrinter, setDraggedPrinter] = useState<string | null>(null);
  const [draggedComputer, setDraggedComputer] = useState<string | null>(null);
  const [draggedTV, setDraggedTV] = useState<string | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (draggedPrinter || draggedComputer || draggedTV || selectedPrinter || selectedComputer || selectedTV) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const image = imageRef.current;
    if (!image) return;

    const imageRect = image.getBoundingClientRect();
    const x = ((event.clientX - imageRect.left) / imageRect.width) * 100;
    const y = ((event.clientY - imageRect.top) / imageRect.height) * 100;

    if (deviceMode === 'printers') {
      onAddPrinter(x, y);
    } else if (deviceMode === 'computers') {
      onAddComputer(x, y);
    } else if (deviceMode === 'tvs') {
      onAddTV(x, y);
    }
  };

  const handlePrinterDrag = (printerId: string, deltaX: number, deltaY: number) => {
    const printer = printers.find(p => p.id === printerId);
    if (!printer || !imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();
    const newX = printer.x_position + (deltaX / imageRect.width) * 100;
    const newY = printer.y_position + (deltaY / imageRect.height) * 100;

    // Constrain to image boundaries
    const constrainedX = Math.max(0, Math.min(100, newX));
    const constrainedY = Math.max(0, Math.min(100, newY));

    onUpdatePrinter({
      ...printer,
      x_position: constrainedX,
      y_position: constrainedY
    });
  };

  const handleComputerDrag = (computerId: string, deltaX: number, deltaY: number) => {
    const computer = computers.find(c => c.id === computerId);
    if (!computer || !imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();
    const newX = computer.x_position + (deltaX / imageRect.width) * 100;
    const newY = computer.y_position + (deltaY / imageRect.height) * 100;

    // Constrain to image boundaries
    const constrainedX = Math.max(0, Math.min(100, newX));
    const constrainedY = Math.max(0, Math.min(100, newY));

    onUpdateComputer({
      ...computer,
      x_position: constrainedX,
      y_position: constrainedY
    });
  };

  const handleTVDrag = (tvId: string, deltaX: number, deltaY: number) => {
    const tv = tvs.find(t => t.id === tvId);
    if (!tv || !imageRef.current) return;

    const imageRect = imageRef.current.getBoundingClientRect();
    const newX = tv.x_position + (deltaX / imageRect.width) * 100;
    const newY = tv.y_position + (deltaY / imageRect.height) * 100;

    // Constrain to image boundaries
    const constrainedX = Math.max(0, Math.min(100, newX));
    const constrainedY = Math.max(0, Math.min(100, newY));

    onUpdateTV({
      ...tv,
      x_position: constrainedX,
      y_position: constrainedY
    });
  };

  return (
    <div className="flex-1 bg-gray-100 relative overflow-hidden">
      <TransformWrapper
        initialScale={0.8}
        minScale={0.3}
        maxScale={3}
        centerOnInit
        wheel={{ step: 0.1 }}
        panning={{ velocityDisabled: true }}
      >
        <TransformComponent
          wrapperClass="w-full h-full flex items-center justify-center"
          contentClass="relative max-w-full max-h-full"
        >
          <div 
            className="relative inline-block cursor-crosshair"
            onClick={handleCanvasClick}
          >
            <img
              ref={imageRef}
              src={floorPlan.image_url}
              alt={floorPlan.name}
              className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
              draggable={false}
            />
            
            {/* Printer Icons */}
            {printers.map((printer) => (
              <PrinterIcon
                key={printer.id}
                printer={printer}
                onSelect={() => setSelectedPrinter(printer)}
                onDragStart={() => setDraggedPrinter(printer.id)}
                onDragEnd={() => setDraggedPrinter(null)}
                onDrag={handlePrinterDrag}
                isDragging={draggedPrinter === printer.id}
              />
            ))}

            {/* Computer Icons */}
            {computers.map((computer) => (
              <ComputerIcon
                key={computer.id}
                computer={computer}
                onSelect={() => setSelectedComputer(computer)}
                onDragStart={() => setDraggedComputer(computer.id)}
                onDragEnd={() => setDraggedComputer(null)}
                onDrag={handleComputerDrag}
                isDragging={draggedComputer === computer.id}
              />
            ))}

            {/* TV Icons */}
            {tvs.map((tv) => (
              <TVIcon
                key={tv.id}
                tv={tv}
                onSelect={() => setSelectedTV(tv)}
                onDragStart={() => setDraggedTV(tv.id)}
                onDragEnd={() => setDraggedTV(null)}
                onDrag={handleTVDrag}
                isDragging={draggedTV === tv.id}
              />
            ))}
          </div>
        </TransformComponent>
      </TransformWrapper>

      {/* Printer Edit Modal */}
      {selectedPrinter && (
        <PrinterModal
          printer={selectedPrinter}
          onClose={() => setSelectedPrinter(null)}
          onUpdate={onUpdatePrinter}
          onDelete={() => {
            onDeletePrinter(selectedPrinter.id);
            setSelectedPrinter(null);
          }}
        />
      )}

      {/* Computer Edit Modal */}
      {selectedComputer && (
        <ComputerModal
          computer={selectedComputer}
          onClose={() => setSelectedComputer(null)}
          onUpdate={onUpdateComputer}
          onDelete={() => {
            onDeleteComputer(selectedComputer.id);
            setSelectedComputer(null);
          }}
        />
      )}

      {/* TV Edit Modal */}
      {selectedTV && (
        <TVModal
          tv={selectedTV}
          onClose={() => setSelectedTV(null)}
          onUpdate={onUpdateTV}
          onDelete={() => {
            onDeleteTV(selectedTV.id);
            setSelectedTV(null);
          }}
        />
      )}

      {/* Instructions */}
      {((deviceMode === 'printers' && printers.length === 0) || (deviceMode === 'computers' && computers.length === 0) || (deviceMode === 'tvs' && tvs.length === 0)) && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
          <p className="text-sm font-medium">
            Click anywhere on the floor plan to add a {deviceMode === 'printers' ? 'printer' : deviceMode === 'computers' ? 'computer' : 'TV'}
          </p>
        </div>
      )}
    </div>
  );
}