"use client";

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { toast } from '@/lib/utils/toast';

export type ClientType = 'Lead' | 'Data' | 'Paying';
export type PipelineStage = 'Inquiry' | 'Contacted' | 'Proposal' | 'Won' | 'Lost';
export type InvoiceStatus = 'Unpaid' | 'Paid' | 'Overdue';

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  company: string | null;
  status: string | null;
  client_type: ClientType | null;
  website: string | null;
  notes: string | null;
  last_contact: string | null;
  source: string | null;
  pipeline_stage: PipelineStage | null;
  next_follow_up: string | null;
  deal_value: number | null;
  invoice_status: InvoiceStatus | null;
  invoice_due_date: string | null;
  billing_type: string | null;
  billing_frequency: string | null;
  recurring_amount: number | null;
  next_billing_date: string | null;
  services: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  industry: string;
  status: string;
  client_type: ClientType;
  website: string;
  has_website: string;
  needs_website: string;
  notes: string;
  source: string;
  pipeline_stage: PipelineStage;
  next_follow_up: string;
  deal_value: string;
  invoice_status: InvoiceStatus;
  invoice_due_date: string;
  billing_type: string;
  billing_frequency: string;
  recurring_amount: string;
  next_billing_date: string;
  services: string;
}

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  company_name: string | null;
  phone: string | null;
  industry: string | null;
  website: string | null;
  role: string | null;
  company_size: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createSupabaseBrowserClient();

  const fetchClients = async (isMounted = true) => {
    try {
      if (!isMounted) return;
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !isMounted) {
        if (isMounted) {
          setError('Not authenticated');
          setLoading(false);
        }
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!isMounted) return;
      if (fetchError) throw fetchError;
      setClients(data || []);
      setError(null);
    } catch (err: any) {
      // Ignore abort errors
      if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
      setError(err.message);
      toast.error('Failed to fetch clients');
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchClients(isMounted);
    return () => { isMounted = false; };
  }, []);

  const normalizeClientPayload = (clientData: Partial<ClientFormData>) => {
    const dealValue =
      clientData.deal_value === undefined
        ? undefined
        : clientData.deal_value === ''
          ? null
          : Number(clientData.deal_value);

    const recurringAmount =
      clientData.recurring_amount === undefined
        ? undefined
        : clientData.recurring_amount === ''
          ? null
          : Number(clientData.recurring_amount);

    const nextFollowUp =
      clientData.next_follow_up === undefined
        ? undefined
        : clientData.next_follow_up
          ? new Date(clientData.next_follow_up).toISOString()
          : null;

    const invoiceDueDate =
      clientData.invoice_due_date === undefined
        ? undefined
        : clientData.invoice_due_date
          ? clientData.invoice_due_date
          : null;

    const nextBillingDate =
      clientData.next_billing_date === undefined
        ? undefined
        : clientData.next_billing_date
          ? clientData.next_billing_date
          : null;

    return {
      ...clientData,
      deal_value: Number.isNaN(dealValue as number) ? null : dealValue,
      recurring_amount: Number.isNaN(recurringAmount as number) ? null : recurringAmount,
      next_follow_up: nextFollowUp,
      invoice_due_date: invoiceDueDate,
      next_billing_date: nextBillingDate,
    };
  };

  const createClient = async (clientData: ClientFormData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const payload = normalizeClientPayload(clientData);
      
      // Build notes with additional info
      let notes = clientData.notes || '';
      const additionalInfo: string[] = [];
      if (clientData.industry) {
        additionalInfo.push(`Line of Business: ${clientData.industry}`);
      }
      if (clientData.has_website) {
        additionalInfo.push(`Has Website: ${clientData.has_website}`);
      }
      if (clientData.needs_website) {
        additionalInfo.push(`Needs Website: ${clientData.needs_website}`);
      }
      if (additionalInfo.length > 0) {
        notes = notes ? `${notes}\n\n${additionalInfo.join('\n')}` : additionalInfo.join('\n');
      }
      
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
          client_type: clientData.client_type || 'Lead',
          website: clientData.website || null,
          notes: notes || null,
          source: clientData.source || null,
          pipeline_stage: payload.pipeline_stage || 'Inquiry',
          next_follow_up: payload.next_follow_up ?? null,
          deal_value: payload.deal_value ?? null,
          invoice_status: payload.invoice_status || 'Unpaid',
          invoice_due_date: payload.invoice_due_date ?? null,
          billing_type: clientData.billing_type || 'One-time',
          billing_frequency: clientData.billing_frequency || null,
          recurring_amount: payload.recurring_amount ?? null,
          next_billing_date: payload.next_billing_date ?? null,
          services: clientData.services || null,
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
      const payload = normalizeClientPayload(clientData);
      
      // Build notes with additional info if new fields are provided
      let updateData: any = { ...payload };
      if (clientData.industry !== undefined || clientData.has_website !== undefined || clientData.needs_website !== undefined) {
        // Get existing client to preserve existing notes
        const { data: existingClient } = await supabase
          .from('clients')
          .select('notes')
          .eq('id', id)
          .single();
        
        let notes = existingClient?.notes || clientData.notes || '';
        const additionalInfo: string[] = [];
        
        if (clientData.industry) {
          additionalInfo.push(`Line of Business: ${clientData.industry}`);
        }
        if (clientData.has_website !== undefined) {
          additionalInfo.push(`Has Website: ${clientData.has_website}`);
        }
        if (clientData.needs_website) {
          additionalInfo.push(`Needs Website: ${clientData.needs_website}`);
        }
        
        if (additionalInfo.length > 0) {
          // Remove old entries if they exist and add new ones
          notes = notes.split('\n').filter(line => 
            !line.includes('Line of Business:') && 
            !line.includes('Has Website:') && 
            !line.includes('Needs Website:')
          ).join('\n').trim();
          notes = notes ? `${notes}\n\n${additionalInfo.join('\n')}` : additionalInfo.join('\n');
        }
        
        updateData.notes = notes || null;
      }
      
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          ...updateData,
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

  const updateLastContact = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('clients')
        .update({
          last_contact: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;
      await fetchClients();
      toast.success('Last contact updated');
      return { success: true };
    } catch (err: any) {
      toast.error(err.message || 'Failed to update last contact');
      return { success: false, error: err.message };
    }
  };

  const bulkCreateClients = async (
    rows: Array<Partial<ClientFormData> & { name: string }>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const toInsert = rows
        .filter((row) => row.name && row.name.trim())
        .map((row) => {
          const payload = normalizeClientPayload(row);
          return {
            user_id: user.id,
            name: row.name.trim(),
            email: row.email ? String(row.email) : null,
            phone: row.phone ? String(row.phone) : null,
            address: row.address ? String(row.address) : null,
            company: row.company ? String(row.company) : null,
            status: row.status || 'Active',
            client_type: (row.client_type as ClientType) || 'Lead',
            website: row.website ? String(row.website) : null,
            notes: row.notes ? String(row.notes) : null,
            source: row.source ? String(row.source) : null,
            pipeline_stage: (payload.pipeline_stage as PipelineStage) || 'Inquiry',
            next_follow_up: payload.next_follow_up ?? null,
            deal_value: payload.deal_value ?? null,
            invoice_status: (payload.invoice_status as InvoiceStatus) || 'Unpaid',
            invoice_due_date: payload.invoice_due_date ?? null,
            billing_type: row.billing_type ? String(row.billing_type) : 'One-time',
            billing_frequency: row.billing_frequency ? String(row.billing_frequency) : null,
            recurring_amount: payload.recurring_amount ?? null,
            next_billing_date: payload.next_billing_date ?? null,
            services: row.services ? String(row.services) : null,
          };
        });

      if (toInsert.length === 0) {
        toast.error('No valid rows to import');
        return { success: false as const };
      }

      const { error: insertError } = await supabase
        .from('clients')
        .insert(toInsert);

      if (insertError) throw insertError;

      await fetchClients();
      toast.success(`Imported ${toInsert.length} clients`);
      return { success: true as const, count: toInsert.length };
    } catch (err: any) {
      toast.error(err.message || 'Failed to import clients');
      return { success: false as const, error: err.message as string };
    }
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
    updateLastContact,
    bulkCreateClients,
  };
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createSupabaseBrowserClient();

  const fetchProfile = async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || signal?.aborted) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (signal?.aborted) return;
      if (error && error.code !== 'PGRST116') throw error;
      setProfile(data);
    } catch (err: any) {
      // Ignore abort errors (component unmounted)
      if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
      console.error('Failed to fetch profile:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;
      await fetchProfile();
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchProfile(abortController.signal);
    return () => abortController.abort();
  }, []);

  return {
    profile,
    loading,
    fetchProfile: () => fetchProfile(),
    updateProfile,
  };
}
