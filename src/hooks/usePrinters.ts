import { useState, useEffect } from 'react';
import { supabase, Printer, PrinterFormData } from '../lib/supabase';

export function usePrinters(floorPlanId: string | null) {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrinters = async () => {
    if (!floorPlanId) {
      setPrinters([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('printers')
        .select('*')
        .eq('floor_plan_id', floorPlanId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPrinters(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch printers');
    } finally {
      setLoading(false);
    }
  };

  const createPrinter = async (x: number, y: number) => {
    if (!floorPlanId) return null;

    try {
      const { data, error } = await supabase
        .from('printers')
        .insert([{
          floor_plan_id: floorPlanId,
          name: 'New Printer',
          model: '',
          toner: 'Full',
          status: 'Online',
          x_position: x,
          y_position: y
        }])
        .select()
        .single();

      if (error) throw error;
      
      setPrinters(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create printer');
      throw err;
    }
  };

  const updatePrinter = async (id: string, updates: Partial<Printer>) => {
    try {
      const { data, error } = await supabase
        .from('printers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPrinters(prev => prev.map(p => p.id === id ? data : p));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update printer');
      throw err;
    }
  };

  const deletePrinter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('printers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPrinters(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete printer');
      throw err;
    }
  };

  useEffect(() => {
    fetchPrinters();
  }, [floorPlanId]);

  return {
    printers,
    loading,
    error,
    createPrinter,
    updatePrinter,
    deletePrinter,
    refetch: fetchPrinters
  };
}