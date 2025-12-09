import React from 'react';
import { InventoryList } from './InventoryList';
import { useInventory } from '../hooks/useInventory';

export function InventorySection() {
  const {
    devices: inventoryDevices,
    loading: inventoryLoading,
    createDevice: createInventoryDevice,
    updateDevice: updateInventoryDevice,
    deleteDevice: deleteInventoryDevice
  } = useInventory();

  return (
    <div className="h-full overflow-y-auto p-6">
      <InventoryList
        devices={inventoryDevices}
        onCreateDevice={createInventoryDevice}
        onUpdateDevice={updateInventoryDevice}
        onDeleteDevice={deleteInventoryDevice}
        loading={inventoryLoading}
      />
    </div>
  );
}