import { useState, useEffect } from 'react';
import { tvsApi, TV } from '../lib/api';

export type { TV };
export type TVFormData = Pick<TV, 'name' | 'model' | 'size' | 'type' | 'status'>;

export function useTVs(floorPlanId: string | null) {
  const [tvs, setTVs] = useState<TV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTVs = async () => {
    if (!floorPlanId) { setTVs([]); setLoading(false); return; }
    try {
      setLoading(true);
      const data = await tvsApi.getByFloorPlan(floorPlanId);
      setTVs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch TVs');
    } finally {
      setLoading(false);
    }
  };

  const createTV = async (x: number, y: number) => {
    if (!floorPlanId) return null;
    try {
      const data = await tvsApi.create({
        floor_plan_id: floorPlanId,
        name: 'New TV', model: '', size: '55"',
        type: 'LED', status: 'Online', x_position: x, y_position: y,
      });
      setTVs(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create TV');
      throw err;
    }
  };

  const updateTV = async (id: string, updates: Partial<TV>) => {
    try {
      const data = await tvsApi.update(id, updates);
      setTVs(prev => prev.map(t => t.id === id ? data : t));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update TV');
      throw err;
    }
  };

  const deleteTV = async (id: string) => {
    try {
      await tvsApi.delete(id);
      setTVs(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete TV');
      throw err;
    }
  };

  useEffect(() => { fetchTVs(); }, [floorPlanId]);

  return { tvs, loading, error, createTV, updateTV, deleteTV, refetch: fetchTVs };
}
