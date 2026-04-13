import { useState, useEffect } from 'react';
import { printersApi, Printer } from '../lib/api';

export type { Printer };
export type PrinterFormData = Pick<Printer, 'name' | 'model' | 'toner' | 'status'>;

export function usePrinters(floorPlanId: string | null) {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrinters = async () => {
    if (!floorPlanId) { setPrinters([]); setLoading(false); return; }
    try {
      setLoading(true);
      const data = await printersApi.getByFloorPlan(floorPlanId);
      setPrinters(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch printers');
    } finally {
      setLoading(false);
    }
  };

  const createPrinter = async (x: number, y: number) => {
    if (!floorPlanId) return null;
    try {
      const data = await printersApi.create({
        floor_plan_id: floorPlanId,
        name: 'New Printer', model: '', toner: 'Full',
        status: 'Online', x_position: x, y_position: y,
      });
      setPrinters(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create printer');
      throw err;
    }
  };

  const updatePrinter = async (id: string, updates: Partial<Printer>) => {
    try {
      const data = await printersApi.update(id, updates);
      setPrinters(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update printer');
      throw err;
    }
  };

  const deletePrinter = async (id: string) => {
    try {
      await printersApi.delete(id);
      setPrinters(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete printer');
      throw err;
    }
  };

  useEffect(() => { fetchPrinters(); }, [floorPlanId]);

  return { printers, loading, error, createPrinter, updatePrinter, deletePrinter, refetch: fetchPrinters };
}
