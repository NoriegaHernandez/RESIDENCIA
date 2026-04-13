import { useState, useEffect } from 'react';
import { computersApi } from '../lib/supabase';

export interface Computer {
  id: string;
  floor_plan_id: string;
  name: string;
  model: string;
  type: string;
  os: string;
  status: string;
  hostname: string;
  username: string;
  ip: string;
  x_position: number;
  y_position: number;
  created_at: string;
  updated_at: string;
}

export interface ComputerFormData {
  name: string;
  model: string;
  type: string;
  os: string;
  status: string;
  hostname: string;
  username: string;
  ip: string;
}

export function useComputers(floorPlanId: string | null) {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 const fetchComputers = async () => {
  if (!floorPlanId) {
    setComputers([]);
    setLoading(false);
    return;
  }

  try {
    setLoading(true);
    const data = await computersApi.getByFloorPlan(floorPlanId);
    setComputers(data || []);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to fetch computers');
  } finally {
    setLoading(false);
  }
};

 const createComputer = async (x: number, y: number) => {
  if (!floorPlanId) return null;

  try {
    const data = await computersApi.create({
      floor_plan_id: floorPlanId,
      name: 'New Computer',
      model: '',
      type: 'Desktop',
      os: 'Windows',
      status: 'Online',
      hostname: '',
      username: '',
      ip: '',
      x_position: x,
      y_position: y
    });

    setComputers(prev => [...prev, data]);
    return data;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create computer');
    throw err;
  }
};
const updateComputer = async (id: string, updates: Partial<Computer>) => {
  try {
    const data = await computersApi.update(id, updates);

    setComputers(prev => prev.map(c => c.id === id ? data : c));
    return data;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update computer');
    throw err;
  }
};

const deleteComputer = async (id: string) => {
  try {
    await computersApi.delete(id);

    setComputers(prev => prev.filter(c => c.id !== id));
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete computer');
    throw err;
  }
};

  useEffect(() => {
    fetchComputers();
  }, [floorPlanId]);

  return {
    computers,
    loading,
    error,
    createComputer,
    updateComputer,
    deleteComputer,
    refetch: fetchComputers
  };
}