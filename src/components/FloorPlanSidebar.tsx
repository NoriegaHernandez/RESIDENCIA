import React, { useState } from 'react';
import { Plus, Upload, Trash2, Building } from 'lucide-react';
import { FloorPlan } from '../lib/supabase';

interface FloorPlanSidebarProps {
  floorPlans: FloorPlan[];
  selectedFloorPlan: FloorPlan | null;
  onSelectFloorPlan: (floorPlan: FloorPlan) => void;
  onUploadFloorPlan: (name: string, file: File) => void;
  onDeleteFloorPlan: (id: string) => void;
  loading: boolean;
}

export function FloorPlanSidebar({
  floorPlans,
  selectedFloorPlan,
  onSelectFloorPlan,
  onUploadFloorPlan,
  onDeleteFloorPlan,
  loading
}: FloorPlanSidebarProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [newPlanName, setNewPlanName] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !newPlanName.trim()) return;

    setIsUploading(true);
    try {
      await onUploadFloorPlan(newPlanName.trim(), file);
      setNewPlanName('');
      event.target.value = '';
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Building className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Floor Plans</h2>
        </div>

        {/* Upload Form */}
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Floor plan name..."
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <label className="relative cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={!newPlanName.trim() || isUploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              newPlanName.trim() && !isUploading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}>
              {isUploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {isUploading ? 'Uploading...' : 'Upload Floor Plan'}
            </div>
          </label>
        </div>
      </div>

      {/* Floor Plans List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : floorPlans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Building className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No floor plans yet</p>
            <p className="text-xs text-gray-400 mt-1">Upload your first floor plan to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {floorPlans.map((plan) => (
              <div
                key={plan.id}
                className={`relative group p-3 rounded-lg border transition-all cursor-pointer ${
                  selectedFloorPlan?.id === plan.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => onSelectFloorPlan(plan)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{plan.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(plan.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFloorPlan(plan.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 transition-opacity"
                    title="Delete floor plan"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}