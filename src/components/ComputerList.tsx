import React from 'react';
import { Monitor, Edit, Trash2, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { Computer } from '../hooks/useComputers';

interface ComputerListProps {
  computers: Computer[];
  onEditComputer: (computer: Computer) => void;
  onDeleteComputer: (id: string) => void;
}

export function ComputerList({ computers, onEditComputer, onDeleteComputer }: ComputerListProps) {
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

  if (computers.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Monitor className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">No computers added yet</p>
        <p className="text-xs text-gray-400 mt-1">Click on the floor plan to add computers</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {computers.map((computer) => (
        <div
          key={computer.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Monitor className="h-5 w-5 text-purple-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{computer.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(computer.status)}`}>
                    {getStatusIcon(computer.status)}
                    <span className="ml-1">{computer.status}</span>
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  {computer.model && (
                    <p><span className="font-medium">Model:</span> {computer.model}</p>
                  )}
                  <p><span className="font-medium">Type:</span> {computer.type} • <span className="font-medium">OS:</span> {computer.os}</p>
                  {computer.hostname && (
                    <p><span className="font-medium">Hostname:</span> {computer.hostname}</p>
                  )}
                  {computer.username && (
                    <p><span className="font-medium">Username:</span> {computer.username}</p>
                  )}
                  {computer.ip && (
                    <p><span className="font-medium">IP:</span> {computer.ip}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Position: {computer.x_position.toFixed(1)}%, {computer.y_position.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onEditComputer(computer)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit computer"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteComputer(computer.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete computer"
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