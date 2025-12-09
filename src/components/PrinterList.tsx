import React from 'react';
import { Printer as PrinterIcon, Edit, Trash2, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { Printer } from '../lib/supabase';

interface PrinterListProps {
  printers: Printer[];
  onEditPrinter: (printer: Printer) => void;
  onDeletePrinter: (id: string) => void;
}

export function PrinterList({ printers, onEditPrinter, onDeletePrinter }: PrinterListProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return <Wifi className="h-4 w-4 text-green-600" />;
      case 'offline':
        return <WifiOff className="h-4 w-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (printers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <PrinterIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">No printers added yet</p>
        <p className="text-xs text-gray-400 mt-1">Click on the floor plan to add printers</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {printers.map((printer) => (
        <div
          key={printer.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PrinterIcon className="h-5 w-5 text-blue-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{printer.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(printer.status)}`}>
                    {getStatusIcon(printer.status)}
                    <span className="ml-1">{printer.status}</span>
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  {printer.model && (
                    <p><span className="font-medium">Model:</span> {printer.model}</p>
                  )}
                  <p><span className="font-medium">Toner:</span> {printer.toner}</p>
                  <p className="text-xs text-gray-500">
                    Position: {printer.x_position.toFixed(1)}%, {printer.y_position.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onEditPrinter(printer)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit printer"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeletePrinter(printer.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete printer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}