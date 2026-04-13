import { useState, useEffect } from 'react';
import { floorPlansApi, FloorPlan } from '../lib/supabase';

export function useFloorPlans() {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 

const fetchFloorPlans = async () => {
  try {
    setLoading(true);
    const data = await floorPlansApi.getAll();
    setFloorPlans(data || []);
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
};

  const createFloorPlan = async (name: string, imageFile: File) => {
  try {
    const imageUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });

    const data = await floorPlansApi.create(name, imageUrl);

    setFloorPlans(prev => [...prev, data]);
    return data;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to create floor plan');
    throw err;
  }
};

const deleteFloorPlan = async (id: string) => {
  try {
    await floorPlansApi.delete(id);

    setFloorPlans(prev => prev.filter(plan => plan.id !== id));
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to delete floor plan');
    throw err;
  }
};

  useEffect(() => {
    fetchFloorPlans();
  }, []);

  return {
    floorPlans,
    loading,
    error,
    createFloorPlan,
    deleteFloorPlan,
    refetch: fetchFloorPlans
  };
}