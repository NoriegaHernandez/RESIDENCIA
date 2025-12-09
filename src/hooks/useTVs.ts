import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface TV {
  id: string;
  floor_plan_id: string;
  name: string;
  model: string;
  size: string;
  type: string;
  status: string;
  x_position: number;
  y_position: number;
  created_at: string;
  updated_at: string;
}

export interface TVFormData {
  name: string;
  model: string;
  size: string;
  type: string;
  status: string;
}

export function useTVs(floorPlanId: string | null) {
  const [tvs, setTVs] = useState<TV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTVs = async () => {
    if (!floorPlanId) {
      setTVs([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tvs')
        .select('*')
        .eq('floor_plan_id', floorPlanId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTVs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch TVs');
    } finally {
      setLoading(false);
    }
  };

  const createTV = async (x: number, y: number) => {
    if (!floorPlanId) return null;

    try {
      const { data, error } = await supabase
        .from('tvs')
        .insert([{
          floor_plan_id: floorPlanId,
          name: 'New TV',
          model: '',
          size: '55"',
          type: 'LED',
          status: 'Online',
          x_position: x,
          y_position: y
        }])
        .select()
        .single();

      if (error) throw error;
      
      setTVs(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create TV');
      throw err;
    }
  };

  const updateTV = async (id: string, updates: Partial<TV>) => {
    try {
      const { data, error } = await supabase
        .from('tvs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setTVs(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update TV');
      throw err;
    }
  };

  const deleteTV = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tvs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setTVs(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete TV');
      throw err;
    }
  };

  useEffect(() => {
    fetchTVs();
  }, [floorPlanId]);

  return {
    tvs,
    loading,
    error,
    createTV,
    updateTV,
    deleteTV,
    refetch: fetchTVs
  };
}