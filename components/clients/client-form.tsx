"use client";

import { useState, useEffect } from 'react';
import { PhoneInput } from '@/components/ui/phone-input';
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
    industry: initialData?.industry || '',
    status: initialData?.status || 'Active',
    client_type: initialData?.client_type || 'Lead',
    website: initialData?.website || '',
    has_website: initialData?.has_website || '',
    needs_website: initialData?.needs_website || '',
    notes: initialData?.notes || '',
    source: initialData?.source || '',
    pipeline_stage: initialData?.pipeline_stage || 'Inquiry',
    next_follow_up: initialData?.next_follow_up || '',
    deal_value: initialData?.deal_value?.toString() || '',
    invoice_status: initialData?.invoice_status || 'Unpaid',
    invoice_due_date: initialData?.invoice_due_date || '',
    billing_type: initialData?.billing_type || 'One-time',
    billing_frequency: initialData?.billing_frequency || '',
    recurring_amount: initialData?.recurring_amount?.toString() || '',
    next_billing_date: initialData?.next_billing_date || '',
    services: initialData?.services || '',
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
        industry: initialData.industry || '',
        status: initialData.status || 'Active',
        client_type: initialData.client_type || 'Lead',
        website: initialData.website || '',
        has_website: initialData.has_website || '',
        needs_website: initialData.needs_website || '',
        notes: initialData.notes || '',
        source: initialData.source || '',
        pipeline_stage: initialData.pipeline_stage || 'Inquiry',
        next_follow_up: initialData.next_follow_up || '',
        deal_value: initialData.deal_value?.toString() || '',
        invoice_status: initialData.invoice_status || 'Unpaid',
        invoice_due_date: initialData.invoice_due_date || '',
        billing_type: initialData.billing_type || 'One-time',
        billing_frequency: initialData.billing_frequency || '',
        recurring_amount: initialData.recurring_amount?.toString() || '',
        next_billing_date: initialData.next_billing_date || '',
        services: initialData.services || '',
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
        industry: '',
        status: 'Active',
        client_type: 'Lead',
        website: '',
        has_website: '',
        needs_website: '',
        notes: '',
        source: '',
        pipeline_stage: 'Inquiry',
        next_follow_up: '',
        deal_value: '',
        invoice_status: 'Unpaid',
        invoice_due_date: '',
        billing_type: 'One-time',
        billing_frequency: '',
        recurring_amount: '',
        next_billing_date: '',
        services: '',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Basic Info */}
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-800">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Client name"
            required
            className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-800">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="client@example.com"
            required
            className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-800">
            Phone
          </label>
          <PhoneInput
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            placeholder="97 123 4567"
            defaultCountry="ZM"
          />
        </div>

        {/* Company Info */}
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-800">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Company name"
            required
            className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-800">
            Line of Business
          </label>
          <input
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            placeholder="e.g., Technology, Healthcare, Retail, etc."
            className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-800">
            Do you have a website?
          </label>
          <Select
            value={formData.has_website}
            onValueChange={(value) => {
              setFormData({ 
                ...formData, 
                has_website: value,
                website: value === 'No' ? '' : formData.website,
                needs_website: value === 'No' ? formData.needs_website : ''
              });
            }}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Yes" className="text-base py-3">Yes</SelectItem>
              <SelectItem value="No" className="text-base py-3">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {formData.has_website === 'Yes' && (
          <div className="space-y-3">
            <label className="text-base font-semibold text-gray-800">
              Website URL
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
              className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        {formData.has_website === 'No' && (
          <div className="space-y-3">
            <label className="text-base font-semibold text-gray-800">
              Do you need a website?
            </label>
            <Select
              value={formData.needs_website}
              onValueChange={(value) => setFormData({ ...formData, needs_website: value })}
            >
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes" className="text-base py-3">Yes, I need one</SelectItem>
                <SelectItem value="No" className="text-base py-3">No, not interested</SelectItem>
                <SelectItem value="Maybe" className="text-base py-3">Maybe later</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-800">
            Source
          </label>
          <input
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="Referral, Website, Ad, etc."
            className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Fields */}
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-800">
            Client Type
          </label>
          <Select
            value={formData.client_type}
            onValueChange={(value: ClientType) => {
              const nextState: ClientFormData = { ...formData, client_type: value };
              if (value !== 'Paying') {
                nextState.billing_type = 'One-time';
                nextState.billing_frequency = '';
                nextState.recurring_amount = '';
                nextState.next_billing_date = '';
                nextState.services = '';
                nextState.invoice_status = 'Unpaid';
                nextState.invoice_due_date = '';
                nextState.deal_value = '';
              }
              if (value === 'Data') {
                nextState.pipeline_stage = 'Inquiry';
                nextState.next_follow_up = '';
              }
              setFormData(nextState);
            }}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lead" className="text-base py-3">Lead</SelectItem>
              <SelectItem value="Data" className="text-base py-3">Data</SelectItem>
              <SelectItem value="Paying" className="text-base py-3">Paying Client</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          <label className="text-base font-semibold text-gray-800">
            Status
          </label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger className="h-12 text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active" className="text-base py-3">Active</SelectItem>
              <SelectItem value="Inactive" className="text-base py-3">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.client_type !== 'Data' && (
          <>
            {/* Pipeline + Follow-up */}
            <div className="space-y-3">
              <label className="text-base font-semibold text-gray-800">
                Pipeline Stage
              </label>
              <Select
                value={formData.pipeline_stage}
                onValueChange={(value: PipelineStage) =>
                  setFormData({ ...formData, pipeline_stage: value })
                }
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inquiry" className="text-base py-3">Inquiry</SelectItem>
                  <SelectItem value="Contacted" className="text-base py-3">Contacted</SelectItem>
                  <SelectItem value="Proposal" className="text-base py-3">Proposal</SelectItem>
                  <SelectItem value="Won" className="text-base py-3">Won</SelectItem>
                  <SelectItem value="Lost" className="text-base py-3">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-base font-semibold text-gray-800">
                Next Follow-up
              </label>
              <input
                type="datetime-local"
                value={formData.next_follow_up}
                onChange={(e) =>
                  setFormData({ ...formData, next_follow_up: e.target.value })
                }
                className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {formData.client_type === 'Paying' && (
          <>
            {/* Invoice Tracking */}
            <div className="space-y-3">
              <label className="text-base font-semibold text-gray-800">
                Deal Value
              </label>
              <input
                type="number"
                inputMode="decimal"
                value={formData.deal_value}
                onChange={(e) =>
                  setFormData({ ...formData, deal_value: e.target.value })
                }
                placeholder="0"
                className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <label className="text-base font-semibold text-gray-800">
                Invoice Status
              </label>
              <Select
                value={formData.invoice_status}
                onValueChange={(value: InvoiceStatus) =>
                  setFormData({ ...formData, invoice_status: value })
                }
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unpaid" className="text-base py-3">Unpaid</SelectItem>
                  <SelectItem value="Paid" className="text-base py-3">Paid</SelectItem>
                  <SelectItem value="Overdue" className="text-base py-3">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <label className="text-base font-semibold text-gray-800">
                Invoice Due Date
              </label>
              <input
                type="date"
                value={formData.invoice_due_date}
                onChange={(e) =>
                  setFormData({ ...formData, invoice_due_date: e.target.value })
                }
                className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-3">
              <label className="text-base font-semibold text-gray-800">
                Billing Type
              </label>
              <Select
                value={formData.billing_type}
                onValueChange={(value) =>
                  setFormData({ ...formData, billing_type: value })
                }
              >
                <SelectTrigger className="h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="One-time" className="text-base py-3">One-time</SelectItem>
                  <SelectItem value="Recurring" className="text-base py-3">Recurring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.billing_type === 'Recurring' && (
              <>
                <div className="space-y-3">
                  <label className="text-base font-semibold text-gray-800">
                    Billing Frequency
                  </label>
                  <Select
                    value={formData.billing_frequency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, billing_frequency: value })
                    }
                  >
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weekly" className="text-base py-3">Weekly</SelectItem>
                      <SelectItem value="Monthly" className="text-base py-3">Monthly</SelectItem>
                      <SelectItem value="Quarterly" className="text-base py-3">Quarterly</SelectItem>
                      <SelectItem value="Yearly" className="text-base py-3">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <label className="text-base font-semibold text-gray-800">
                    Recurring Amount
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={formData.recurring_amount}
                    onChange={(e) =>
                      setFormData({ ...formData, recurring_amount: e.target.value })
                    }
                    placeholder="0"
                    className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-base font-semibold text-gray-800">
                    Next Billing Date
                  </label>
                  <input
                    type="date"
                    value={formData.next_billing_date}
                    onChange={(e) =>
                      setFormData({ ...formData, next_billing_date: e.target.value })
                    }
                    className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="space-y-3 md:col-span-2">
              <label className="text-base font-semibold text-gray-800">
                Services (what they are paying for)
              </label>
              <textarea
                value={formData.services}
                onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                placeholder="Describe the services for this paying client..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-y"
              />
            </div>
          </>
        )}

        {/* Address - Full Width */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-base font-semibold text-gray-800">
            Address
          </label>
          <input
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Street address, City, State, ZIP"
            className="w-full h-12 px-4 text-base text-gray-900 bg-white border border-gray-300 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Notes - Full Width */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-base font-semibold text-gray-800">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Additional notes about this client..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-base text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500 min-h-[120px] resize-y"
          />
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="h-12 px-6 text-base">
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={loading} className="h-12 px-8 text-base font-semibold">
          {loading ? 'Saving...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
