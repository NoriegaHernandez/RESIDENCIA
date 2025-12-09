import { useState, useEffect } from 'react';
import { supabase, FloorPlan } from '../lib/supabase';

export function useFloorPlans() {
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFloorPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('floor_plans')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setFloorPlans(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createFloorPlan = async (name: string, imageFile: File) => {
    try {
      // Convert image to base64 data URL for storage
      const imageUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      // Create floor plan record
      const { data, error } = await supabase
        .from('floor_plans')
        .insert([{ name, image_url: imageUrl }])
        .select()
        .single();

      if (error) throw error;
      
      setFloorPlans(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create floor plan');
      throw err;
    }
  };

  const deleteFloorPlan = async (id: string) => {
    try {
      const { error } = await supabase
        .from('floor_plans')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
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