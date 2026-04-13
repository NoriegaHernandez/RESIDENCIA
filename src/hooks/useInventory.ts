import { useState, useEffect } from 'react';
import { inventoryApi } from '../lib/supabase';


export interface InventoryDevice {
  id: string;
  tag: string;
  employee_number: string;
  user_name: string;
  hostname: string;
  type: string;
  brand: string;
  model: string;
  os_series: string;
  cpu: string;
  ram: string;
  ssd: string;
  req_no: string;
  supplier: string;
  plant_use: string;
  business_unit: string;
  department: string;
  area: string;
  status: string;
  comments: string;
  registration_date: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryFormData {
  tag: string;
  employee_number: string;
  user_name: string;
  hostname: string;
  type: string;
  brand: string;
  model: string;
  os_series: string;
  cpu: string;
  ram: string;
  ssd: string;
  req_no: string;
  supplier: string;
  plant_use: string;
  business_unit: string;
  department: string;
  area: string;
  status: string;
  comments: string;
  registration_date: string;
}

export function useInventory() {
  const [devices, setDevices] = useState<InventoryDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const fetchDevices = async () => {
  try {
    setLoading(true);
    const data = await inventoryApi.getAll();
    setDevices(data || []);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch inventory');
  } finally {
    setLoading(false);
  }
};

const createDevice = async (deviceData: InventoryFormData) => {
  try {
    const data = await inventoryApi.create(deviceData);

    setDevices(prev => [data, ...prev]);
    return data;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create device');
    throw err;
  }
};

const updateDevice = async (id: string, updates: Partial<InventoryDevice>) => {
  try {
    const data = await inventoryApi.update(id, updates);

    setDevices(prev => prev.map(d => d.id === id ? data : d));
    return data;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update device');
    throw err;
  }
};

const deleteDevice = async (id: string) => {
  try {
    await inventoryApi.delete(id);

    setDevices(prev => prev.filter(d => d.id !== id));
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete device');
    throw err;
  }
};

  useEffect(() => {
    fetchDevices();
  }, []);

  return {
    devices,
    loading,
    error,
    createDevice,
    updateDevice,
    deleteDevice,
    refetch: fetchDevices
  };
}