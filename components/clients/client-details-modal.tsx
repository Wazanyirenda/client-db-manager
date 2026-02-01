"use client";

import { Client } from '@/lib/hooks/use-clients';
import { exportClientInvoice } from '@/lib/export';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Envelope, 
  Phone, 
  MapPin, 
  Buildings, 
  Globe, 
  Calendar,
  Clock,
  FileText,
  Tag,
  ArrowSquareOut
} from '@phosphor-icons/react';

interface ClientDetailsModalProps {
  client: Client | null;
  open: boolean;
  onClose: () => void;
  onEdit: (client: Client) => void;
  onUpdateLastContact: (id: string) => void;
}

export function ClientDetailsModal({ 
  client, 
  open, 
  onClose, 
  onEdit,
  onUpdateLastContact 
}: ClientDetailsModalProps) {
  if (!client) return null;

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getClientTypeBadge = (type: string | null) => {
    switch (type) {
      case 'Paying':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Paying Client</Badge>;
      case 'Lead':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Lead</Badge>;
      case 'Data':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Data</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600 border-gray-200">{type || 'Unknown'}</Badge>;
    }
  };

  const formatDateOnly = (dateStr: string | null) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null || Number.isNaN(value)) return '—';
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{client.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                {getClientTypeBadge(client.client_type)}
                <Badge variant={client.status === 'Active' ? 'active' : 'inactive'}>
                  {client.status || 'Active'}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Workflow */} 
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4" weight="fill" />
              Workflow
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <p className="text-xs text-gray-500">Pipeline Stage</p>
                <p className="text-sm text-gray-900">{client.pipeline_stage || 'Inquiry'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Next Follow-up</p>
                <p className="text-sm text-gray-900">{formatDate(client.next_follow_up)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Deal Value</p>
                <p className="text-sm text-gray-900">{client.deal_value ?? '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4 mt-3">
              <div>
                <p className="text-xs text-gray-500">Invoice Status</p>
                <p className="text-sm text-gray-900">{client.invoice_status || 'Unpaid'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Invoice Due Date</p>
                <p className="text-sm text-gray-900">{formatDateOnly(client.invoice_due_date)}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4" weight="fill" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Envelope className="h-4 w-4 text-gray-400 mt-0.5" weight="fill" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  {client.email ? (
                    <a 
                      href={`mailto:${client.email}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {client.email}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400">Not provided</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5" weight="fill" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  {client.phone ? (
                    <a 
                      href={`tel:${client.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {client.phone}
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400">Not provided</p>
                  )}
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" weight="fill" />
                <div>
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-gray-900">{client.address || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-4 w-4 text-gray-400 mt-0.5" weight="fill" />
                <div>
                  <p className="text-xs text-gray-500">Website</p>
                  {client.website ? (
                    <a 
                      href={client.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {client.website.replace(/^https?:\/\//, '')}
                      <ArrowSquareOut className="h-3 w-3" weight="bold" />
                    </a>
                  ) : (
                    <p className="text-sm text-gray-400">Not provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Company & Source */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Buildings className="h-4 w-4" weight="fill" />
              Company Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Buildings className="h-4 w-4 text-gray-400 mt-0.5" weight="fill" />
                <div>
                  <p className="text-xs text-gray-500">Company</p>
                  <p className="text-sm text-gray-900">{client.company || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 text-gray-400 mt-0.5" weight="fill" />
                <div>
                  <p className="text-xs text-gray-500">Source</p>
                  <p className="text-sm text-gray-900">{client.source || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Billing & Services (Paying Clients) */}
          {client.client_type === 'Paying' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" weight="fill" />
                Billing & Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-xs text-gray-500">Billing Type</p>
                  <p className="text-sm text-gray-900">{client.billing_type || 'One-time'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Billing Frequency</p>
                  <p className="text-sm text-gray-900">{client.billing_frequency || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Recurring Amount</p>
                  <p className="text-sm text-gray-900">{formatCurrency(client.recurring_amount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Next Billing Date</p>
                  <p className="text-sm text-gray-900">{client.next_billing_date || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Invoice Status</p>
                  <p className="text-sm text-gray-900">{client.invoice_status || 'Unpaid'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Invoice Due Date</p>
                  <p className="text-sm text-gray-900">{client.invoice_due_date || '—'}</p>
                </div>
              </div>
              {client.services && (
                <div className="mt-3 bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-2">Services</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{client.services}</p>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {client.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" weight="fill" />
                Notes
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{client.notes}</p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" weight="fill" />
              Activity
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" weight="fill" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm text-gray-900">{formatDate(client.created_at)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-gray-400 mt-0.5" weight="fill" />
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm text-gray-900">{formatDate(client.updated_at)}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-gray-400 mt-0.5" weight="fill" />
                <div>
                  <p className="text-xs text-gray-500">Last Contact</p>
                  <p className="text-sm text-gray-900">{formatDate(client.last_contact)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-6 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              onClick={() => onUpdateLastContact(client.id)}
            >
              <Phone className="h-4 w-4 mr-2" weight="fill" />
              Log Contact
            </Button>
            {client.client_type === 'Paying' && (
              <Button variant="outline" onClick={() => exportClientInvoice(client)}>
                <FileText className="h-4 w-4 mr-2" weight="fill" />
                Download Invoice
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button onClick={() => onEdit(client)}>
              Edit Client
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
