import React from 'react';
import { Tv, Edit, Trash2, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { TV } from '../hooks/useTVs';

interface TVListProps {
  tvs: TV[];
  onEditTV: (tv: TV) => void;
  onDeleteTV: (id: string) => void;
}

export function TVList({ tvs, onEditTV, onDeleteTV }: TVListProps) {
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

  if (tvs.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Tv className="h-8 w-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm">No TVs added yet</p>
        <p className="text-xs text-gray-400 mt-1">Click on the floor plan to add TVs</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tvs.map((tv) => (
        <div
          key={tv.id}
          className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Tv className="h-5 w-5 text-purple-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-gray-900 truncate">{tv.name}</h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tv.status)}`}>
                    {getStatusIcon(tv.status)}
                    <span className="ml-1">{tv.status}</span>
                  </span>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  {tv.model && (
                    <p><span className="font-medium">Model:</span> {tv.model}</p>
                  )}
                  <p><span className="font-medium">Size:</span> {tv.size} • <span className="font-medium">Type:</span> {tv.type}</p>
                  <p className="text-xs text-gray-500">
                    Position: {tv.x_position.toFixed(1)}%, {tv.y_position.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 ml-2">
              <button
                onClick={() => onEditTV(tv)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit TV"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDeleteTV(tv.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete TV"
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