"use client";

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  company: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  status: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setClients(data || []);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast.error('Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const createClient = async (clientData: ClientFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: insertError } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          name: clientData.name,
          email: clientData.email || null,
          phone: clientData.phone || null,
          address: clientData.address || null,
          company: clientData.company || null,
          status: clientData.status || 'Active',
        })
        .select()
        .single();

      if (insertError) throw insertError;
      
      setClients([data, ...clients]);
      toast.success('Client created successfully');
      return { success: true, data };
    } catch (err: any) {
      toast.error(err.message || 'Failed to create client');
      return { success: false, error: err.message };
    }
  };

  const updateClient = async (id: string, clientData: Partial<ClientFormData>) => {
    try {
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          ...clientData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;
      
      await fetchClients();
      toast.success('Client updated successfully');
      return { success: true };
    } catch (err: any) {
      toast.error(err.message || 'Failed to update client');
      return { success: false, error: err.message };
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      setClients(clients.filter(c => c.id !== id));
      toast.success('Client deleted successfully');
      return { success: true };
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete client');
      return { success: false, error: err.message };
    }
  };

  const toggleStatus = async (id: string, currentStatus: string | null) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    return updateClient(id, { status: newStatus });
  };

  return {
    clients,
    loading,
    error,
    fetchClients,
    createClient,
    updateClient,
    deleteClient,
    toggleStatus,
  };
}


