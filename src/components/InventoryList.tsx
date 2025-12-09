import React, { useState } from 'react';
import { Package, Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { InventoryDevice } from '../hooks/useInventory';
import { InventoryModal } from './InventoryModal';

interface InventoryListProps {
  devices: InventoryDevice[];
  onCreateDevice: (device: any) => Promise<void>;
  onUpdateDevice: (id: string, updates: any) => Promise<void>;
  onDeleteDevice: (id: string) => Promise<void>;
  loading: boolean;
}

export function InventoryList({ 
  devices, 
  onCreateDevice, 
  onUpdateDevice, 
  onDeleteDevice, 
  loading 
}: InventoryListProps) {
  const [selectedDevice, setSelectedDevice] = useState<InventoryDevice | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredDevices = devices.filter(device => {
    const matchesSearch = !searchQuery || 
      device.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.hostname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    const matchesType = typeFilter === 'all' || device.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const uniqueStatuses = [...new Set(devices.map(d => d.status))].filter(Boolean);
  const uniqueTypes = [...new Set(devices.map(d => d.type))].filter(Boolean);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Device Inventory</h1>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm">
            {filteredDevices.length} device{filteredDevices.length !== 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Device
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by tag, user, hostname, brand, or model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Device List */}
      {filteredDevices.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {devices.length === 0 ? 'No devices registered' : 'No devices match your filters'}
          </h3>
          <p className="text-gray-500 mb-4">
            {devices.length === 0 
              ? 'Start building your device inventory by adding your first device'
              : 'Try adjusting your search or filter criteria'
            }
          </p>
          {devices.length === 0 && (
            <button
              onClick={() => setIsCreating(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add First Device
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specs</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{device.tag}</div>
                      <div className="text-sm text-gray-500">#{device.employee_number}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{device.user_name}</div>
                      <div className="text-xs text-gray-500">{device.hostname}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">{device.brand} {device.model}</div>
                      <div className="text-xs text-gray-500">{device.type} • {device.os_series}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-gray-600 space-y-1">
                        {device.cpu && <div>CPU: {device.cpu}</div>}
                        {device.ram && <div>RAM: {device.ram}</div>}
                        {device.ssd && <div>Storage: {device.ssd}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{device.department}</div>
                      <div className="text-xs text-gray-500">{device.area}</div>
                      <div className="text-xs text-gray-500">{device.business_unit}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(device.status)}`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedDevice(device)}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit device"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteDevice(device.id)}
                          className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete device"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {isCreating && (
        <InventoryModal
          onClose={() => setIsCreating(false)}
          onSave={async (data) => {
            await onCreateDevice(data);
            setIsCreating(false);
          }}
        />
      )}

      {/* Edit Modal */}
      {selectedDevice && (
        <InventoryModal
          device={selectedDevice}
          onClose={() => setSelectedDevice(null)}
          onSave={async (data) => {
            await onUpdateDevice(selectedDevice.id, data);
            setSelectedDevice(null);
          }}
          onDelete={() => {
            onDeleteDevice(selectedDevice.id);
            setSelectedDevice(null);
          }}
        />
      )}
    </div>
  );
}