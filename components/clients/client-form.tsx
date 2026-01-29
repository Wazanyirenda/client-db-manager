"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ClientFormData, ClientType, InvoiceStatus, PipelineStage } from '@/lib/hooks/use-clients';

interface ClientFormProps {
  initialData?: Partial<ClientFormData>;
  onSubmit: (data: ClientFormData) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export function ClientForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = 'Add Client',
}: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    company: initialData?.company || '',
    status: initialData?.status || 'Active',
    client_type: initialData?.client_type || 'Lead',
    website: initialData?.website || '',
    notes: initialData?.notes || '',
    source: initialData?.source || '',
    pipeline_stage: initialData?.pipeline_stage || 'Inquiry',
    next_follow_up: initialData?.next_follow_up || '',
    deal_value: initialData?.deal_value?.toString() || '',
    invoice_status: initialData?.invoice_status || 'Unpaid',
    invoice_due_date: initialData?.invoice_due_date || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        address: initialData.address || '',
        company: initialData.company || '',
        status: initialData.status || 'Active',
        client_type: initialData.client_type || 'Lead',
        website: initialData.website || '',
        notes: initialData.notes || '',
        source: initialData.source || '',
        pipeline_stage: initialData.pipeline_stage || 'Inquiry',
        next_follow_up: initialData.next_follow_up || '',
        deal_value: initialData.deal_value?.toString() || '',
        invoice_status: initialData.invoice_status || 'Unpaid',
        invoice_due_date: initialData.invoice_due_date || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    await onSubmit(formData);
    setLoading(false);

    if (!initialData) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        company: '',
        status: 'Active',
        client_type: 'Lead',
        website: '',
        notes: '',
        source: '',
        pipeline_stage: 'Inquiry',
        next_follow_up: '',
        deal_value: '',
        invoice_status: 'Unpaid',
        invoice_due_date: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Client name"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="client@example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Phone
          </label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        {/* Company Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Company
          </label>
          <Input
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Company name"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Website
          </label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Source
          </label>
          <Input
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="Referral, Website, Ad, etc."
          />
        </div>

        {/* Status Fields */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Client Type
          </label>
          <Select
            value={formData.client_type}
            onValueChange={(value: ClientType) => setFormData({ ...formData, client_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lead">Lead</SelectItem>
              <SelectItem value="Data">Data</SelectItem>
              <SelectItem value="Paying">Paying Client</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pipeline + Follow-up */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Pipeline Stage
          </label>
          <Select
            value={formData.pipeline_stage}
            onValueChange={(value: PipelineStage) =>
              setFormData({ ...formData, pipeline_stage: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inquiry">Inquiry</SelectItem>
              <SelectItem value="Contacted">Contacted</SelectItem>
              <SelectItem value="Proposal">Proposal</SelectItem>
              <SelectItem value="Won">Won</SelectItem>
              <SelectItem value="Lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Next Follow-up
          </label>
          <Input
            type="datetime-local"
            value={formData.next_follow_up}
            onChange={(e) =>
              setFormData({ ...formData, next_follow_up: e.target.value })
            }
          />
        </div>

        {/* Invoice Tracking */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Deal Value
          </label>
          <Input
            type="number"
            inputMode="decimal"
            value={formData.deal_value}
            onChange={(e) =>
              setFormData({ ...formData, deal_value: e.target.value })
            }
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Invoice Status
          </label>
          <Select
            value={formData.invoice_status}
            onValueChange={(value: InvoiceStatus) =>
              setFormData({ ...formData, invoice_status: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Invoice Due Date
          </label>
          <Input
            type="date"
            value={formData.invoice_due_date}
            onChange={(e) =>
              setFormData({ ...formData, invoice_due_date: e.target.value })
            }
          />
        </div>

        {/* Address - Full Width */}
        <div className="space-y-2 md:col-span-2 lg:col-span-3">
          <label className="text-sm font-medium text-gray-700">
            Address
          </label>
          <Input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Street address, City, State, ZIP"
          />
        </div>

        {/* Notes - Full Width */}
        <div className="space-y-2 md:col-span-2 lg:col-span-3">
          <label className="text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes about this client..."
            className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm outline-none placeholder:text-gray-400 focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 min-h-[80px] resize-y"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
