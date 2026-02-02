'use client';

import { useState, useMemo } from 'react';
import { useClients, Client, PipelineStage } from '@/lib/hooks/use-clients';
import { useCurrency } from '@/lib/hooks/use-currency';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import {
  Kanban,
  CurrencyDollar,
  Envelope,
  Buildings,
  Eye,
  PencilSimple,
} from '@phosphor-icons/react';
import { ClientDetailsModal } from '@/components/clients/client-details-modal';
import { ClientDialog } from '@/components/clients/client-dialog';

const PIPELINE_STAGES: { key: PipelineStage; label: string; color: string }[] = [
  { key: 'Inquiry', label: 'Inquiry', color: 'bg-gray-100 border-gray-300 text-gray-700' },
  { key: 'Contacted', label: 'Contacted', color: 'bg-blue-50 border-blue-300 text-blue-700' },
  { key: 'Proposal', label: 'Proposal', color: 'bg-amber-50 border-amber-300 text-amber-700' },
  { key: 'Won', label: 'Won', color: 'bg-emerald-50 border-emerald-300 text-emerald-700' },
  { key: 'Lost', label: 'Lost', color: 'bg-red-50 border-red-300 text-red-700' },
];

export default function PipelinePage() {
  const { clients, loading, updateClient, updateLastContact } = useClients();
  const { formatAmount } = useCurrency();
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [draggedClient, setDraggedClient] = useState<Client | null>(null);

  // Group clients by pipeline stage
  const clientsByStage = useMemo(() => {
    const grouped: Record<PipelineStage, Client[]> = {
      Inquiry: [],
      Contacted: [],
      Proposal: [],
      Won: [],
      Lost: [],
    };

    // Only include leads and paying clients in pipeline (not data)
    clients
      .filter((c) => c.client_type === 'Lead' || c.client_type === 'Paying')
      .forEach((client) => {
        const stage = client.pipeline_stage || 'Inquiry';
        if (grouped[stage]) {
          grouped[stage].push(client);
        } else {
          grouped['Inquiry'].push(client);
        }
      });

    return grouped;
  }, [clients]);

  // Calculate pipeline stats
  const stats = useMemo(() => {
    const totalDeals = clients.filter(
      (c) => c.client_type === 'Lead' || c.client_type === 'Paying'
    ).length;

    const totalValue = clients
      .filter((c) => c.deal_value && c.pipeline_stage !== 'Lost')
      .reduce((sum, c) => sum + (Number(c.deal_value) || 0), 0);

    const wonValue = clients
      .filter((c) => c.deal_value && c.pipeline_stage === 'Won')
      .reduce((sum, c) => sum + (Number(c.deal_value) || 0), 0);

    return { totalDeals, totalValue, wonValue };
  }, [clients]);

  const handleDragStart = (e: React.DragEvent, client: Client) => {
    setDraggedClient(client);
    e.dataTransfer.effectAllowed = 'move';
    // Set data to prevent browser navigation on drop
    e.dataTransfer.setData('text/plain', client.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedClient && draggedClient.pipeline_stage !== stage) {
      // If moving to Won, also update client_type to Paying
      const updates: any = { pipeline_stage: stage };
      if (stage === 'Won') {
        updates.client_type = 'Paying';
      }
      await updateClient(draggedClient.id, updates);
    }
    setDraggedClient(null);
  };

  const handleDragEnd = () => {
    setDraggedClient(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="md" text="Loading pipeline" showLogo={false} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Kanban className="h-7 w-7 text-blue-600" weight="fill" />
            Pipeline
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Drag and drop clients between stages to update their status
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-gray-600">
            <span className="font-semibold text-gray-900">{stats.totalDeals}</span> deals
          </div>
          <div className="text-gray-600">
            <span className="font-semibold text-emerald-600">
              {formatAmount(stats.totalValue)}
            </span>{' '}
            pipeline value
          </div>
          <div className="text-gray-600">
            <span className="font-semibold text-emerald-600">
              {formatAmount(stats.wonValue)}
            </span>{' '}
            won
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-4 overflow-x-auto pb-4" onDragOver={handleDragOver} onDrop={(e) => e.preventDefault()}>
        {PIPELINE_STAGES.map((stage) => (
          <div
            key={stage.key}
            className="flex-shrink-0 w-72"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage.key)}
          >
            {/* Column Header */}
            <div className={`rounded-t-lg border-2 border-b-0 px-4 py-3 ${stage.color}`}>
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{stage.label}</h3>
                <Badge className="bg-white/80 text-gray-700 border-0">
                  {clientsByStage[stage.key].length}
                </Badge>
              </div>
            </div>

            {/* Column Content */}
            <div className="bg-gray-50 border-2 border-t-0 border-gray-200 rounded-b-lg min-h-[400px] p-2 space-y-2">
              {clientsByStage[stage.key].length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  No clients in this stage
                </div>
              ) : (
                clientsByStage[stage.key].map((client) => (
                  <div
                    key={client.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, client)}
                    onDragEnd={handleDragEnd}
                    className={`bg-white rounded-lg border border-gray-200 p-3 cursor-move hover:shadow-md transition-shadow ${
                      draggedClient?.id === client.id ? 'opacity-50' : ''
                    }`}
                  >
                    {/* Client Name */}
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-gray-900 text-sm">{client.name}</h4>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingClient(client);
                          }}
                        >
                          <Eye className="h-4 w-4" weight="fill" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingClient(client);
                          }}
                        >
                          <PencilSimple className="h-4 w-4" weight="fill" />
                        </Button>
                      </div>
                    </div>

                    {/* Client Details */}
                    <div className="mt-2 space-y-1">
                      {client.company && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Buildings className="h-3 w-3" weight="fill" />
                          {client.company}
                        </div>
                      )}
                      {client.email && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Envelope className="h-3 w-3" weight="fill" />
                          {client.email}
                        </div>
                      )}
                    </div>

                    {/* Deal Value */}
                    {client.deal_value && (
                      <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-emerald-600 font-medium text-sm">
                          {formatAmount(Number(client.deal_value))}
                        </div>
                        {client.next_follow_up && new Date(client.next_follow_up) <= new Date() && (
                          <Badge className="bg-amber-100 text-amber-700 text-xs">
                            Follow up
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Client Type Badge */}
                    <div className="mt-2">
                      <Badge
                        className={
                          client.client_type === 'Paying'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }
                      >
                        {client.client_type || 'Lead'}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Pipeline Stages</h3>
        <div className="flex flex-wrap gap-4">
          {PIPELINE_STAGES.map((stage) => (
            <div key={stage.key} className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded border-2 ${stage.color}`} />
              <span className="text-sm text-gray-600">
                <strong>{stage.label}:</strong>{' '}
                {stage.key === 'Inquiry' && 'New potential client'}
                {stage.key === 'Contacted' && 'Initial contact made'}
                {stage.key === 'Proposal' && 'Proposal sent'}
                {stage.key === 'Won' && 'Deal closed'}
                {stage.key === 'Lost' && 'Did not convert'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Client Details Modal */}
      <ClientDetailsModal
        client={viewingClient}
        open={!!viewingClient}
        onClose={() => setViewingClient(null)}
        onEdit={(client) => {
          setViewingClient(null);
          setEditingClient(client);
        }}
        onUpdateLastContact={async (id) => {
          await updateLastContact(id);
        }}
      />

      {/* Edit Dialog */}
      {editingClient && (
        <ClientDialog
          open={!!editingClient}
          onOpenChange={(open) => !open && setEditingClient(null)}
          initialData={{
            name: editingClient.name,
            email: editingClient.email || '',
            phone: editingClient.phone || '',
            address: editingClient.address || '',
            company: editingClient.company || '',
            status: editingClient.status || 'Active',
            client_type: editingClient.client_type || 'Lead',
            website: editingClient.website || '',
            notes: editingClient.notes || '',
            source: editingClient.source || '',
            pipeline_stage: editingClient.pipeline_stage || 'Inquiry',
            next_follow_up: editingClient.next_follow_up || '',
            deal_value: editingClient.deal_value?.toString() || '',
            invoice_status: editingClient.invoice_status || 'Unpaid',
            invoice_due_date: editingClient.invoice_due_date || '',
            billing_type: editingClient.billing_type || 'One-time',
            billing_frequency: editingClient.billing_frequency || '',
            recurring_amount: editingClient.recurring_amount?.toString() || '',
            next_billing_date: editingClient.next_billing_date || '',
            services: editingClient.services || '',
          }}
          onSubmit={async (data) => {
            await updateClient(editingClient.id, data);
            setEditingClient(null);
          }}
          title="Edit Client"
          description="Update the client information below."
        />
      )}
    </div>
  );
}
