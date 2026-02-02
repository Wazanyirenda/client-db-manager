'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useClients, Client, ClientType } from '@/lib/hooks/use-clients';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/export';
import { ClientForm } from '@/components/clients/client-form';
import { ClientDialog } from '@/components/clients/client-dialog';
import { ClientDetailsModal } from '@/components/clients/client-details-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientsSkeleton } from '@/components/ui/loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  PencilSimple,
  Trash,
  DownloadSimple,
  MagnifyingGlass,
  Plus,
  Eye,
  UploadSimple,
  FileXls,
  FileText,
  Funnel,
  X,
  FilePdf,
} from '@phosphor-icons/react';

type SortField = 'name' | 'email' | 'company' | 'status' | 'client_type' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function ClientsPage() {
  const searchParams = useSearchParams();
  const {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    toggleStatus,
    updateLastContact,
    bulkCreateClients,
  } = useClients();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deletingClient, setDeletingClient] = useState<Client | null>(null);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // CSV import
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle URL params for opening modals
  useEffect(() => {
    const addParam = searchParams.get('add');
    const viewParam = searchParams.get('view');
    if (addParam === 'true') {
      setShowAddForm(true);
    }
    if (viewParam) {
      const client = clients.find((c) => c.id === viewParam);
      if (client) {
        setViewingClient(client);
      }
    }
  }, [searchParams, clients]);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.website?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      const matchesType = typeFilter === 'all' || client.client_type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'created_at') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = (aValue || '').toString().toLowerCase();
        bValue = (bValue || '').toString().toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [clients, searchQuery, statusFilter, typeFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedClients.length / pageSize);
  const paginatedClients = filteredAndSortedClients.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const clientsToExport = filteredAndSortedClients;
    switch (format) {
      case 'csv':
        exportToCSV(clientsToExport);
        break;
      case 'excel':
        exportToExcel(clientsToExport);
        break;
      case 'pdf':
        exportToPDF(clientsToExport);
        break;
    }
  };

  const getClientTypeBadge = (type: ClientType | null) => {
    switch (type) {
      case 'Paying':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Paying</Badge>;
      case 'Lead':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Lead</Badge>;
      case 'Data':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Data</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">-</Badge>;
    }
  };

  const parseCSV = (csvText: string) => {
    const lines = csvText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length < 2) return [];

    const splitRow = (row: string) => {
      const out: string[] = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < row.length; i += 1) {
        const ch = row[i];
        if (ch === '"' && row[i + 1] === '"') {
          cur += '"';
          i += 1;
          continue;
        }
        if (ch === '"') {
          inQuotes = !inQuotes;
          continue;
        }
        if (ch === ',' && !inQuotes) {
          out.push(cur.trim());
          cur = '';
          continue;
        }
        cur += ch;
      }
      out.push(cur.trim());
      return out;
    };

    const headers = splitRow(lines[0]).map((h) => h.toLowerCase().trim());
    const rows = lines.slice(1).map((line) => {
      const cols = splitRow(line);
      const obj: Record<string, string> = {};
      headers.forEach((h, idx) => {
        obj[h] = cols[idx] ?? '';
      });
      return obj;
    });
    return rows;
  };

  const handleImportCSV = async (file: File) => {
    const text = await file.text();
    const rows = parseCSV(text);
    const mapped = rows
      .filter((r) => (r['name'] || '').trim())
      .map((r) => ({
        name: (r['name'] || '').trim(),
        email: r['email'] || '',
        phone: r['phone'] || '',
        company: r['company'] || '',
        website: r['website'] || '',
        address: r['address'] || '',
        source: r['source'] || '',
        notes: r['notes'] || '',
        status: r['status'] || 'Active',
        client_type: (r['client_type'] || r['type'] || 'Lead') as any,
        pipeline_stage: (r['pipeline_stage'] || r['stage'] || 'Inquiry') as any,
        next_follow_up: r['next_follow_up'] || '',
        deal_value: r['deal_value'] || '',
        invoice_status: (r['invoice_status'] || 'Unpaid') as any,
        invoice_due_date: r['invoice_due_date'] || '',
      }));

    await bulkCreateClients(mapped);
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || typeFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setTypeFilter('all');
    setCurrentPage(1);
  };

  if (loading) {
    return <ClientsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-500 mt-1">
            {clients.length} total client{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await handleImportCSV(file);
              e.currentTarget.value = '';
            }}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <DownloadSimple className="h-4 w-4 sm:mr-2" weight="bold" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 w-48">
              <DropdownMenuItem
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <UploadSimple className="h-4 w-4" weight="bold" />
                Import CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport('csv')}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <FileText className="h-4 w-4" weight="fill" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport('excel')}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <FileXls className="h-4 w-4" weight="fill" />
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleExport('pdf')}
                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded flex items-center gap-2"
              >
                <FilePdf className="h-4 w-4" weight="fill" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setShowAddForm(true)} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 sm:mr-2" weight="bold" />
            <span className="hidden sm:inline">Add Client</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>

      {/* Add Client Modal */}
      <ClientDialog
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onSubmit={async (data) => {
          await createClient(data);
          setShowAddForm(false);
        }}
        title="Add New Client"
        description="Enter the client's information below."
      />

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search - always full width */}
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" weight="bold" />
            <Input
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          
          {/* Filter row - grid on mobile, flex on desktop */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row gap-2 sm:gap-4">
            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={typeFilter}
              onValueChange={(value) => {
                setTypeFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Lead">Leads</SelectItem>
                <SelectItem value="Data">Data</SelectItem>
                <SelectItem value="Paying">Paying</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={pageSize.toString()}
              onValueChange={(value: string) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 / page</SelectItem>
                <SelectItem value="25">25 / page</SelectItem>
                <SelectItem value="50">50 / page</SelectItem>
                <SelectItem value="100">100 / page</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" onClick={clearFilters} className="gap-1 sm:gap-2">
                <X className="h-4 w-4" weight="bold" />
                <span className="hidden sm:inline">Clear</span>
              </Button>
            )}
          </div>
        </div>
        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Funnel className="h-4 w-4" weight="fill" />
            Showing {filteredAndSortedClients.length} of {clients.length}
          </div>
        )}
      </div>

      {/* Clients List - Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginatedClients.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center text-gray-500">
            {hasActiveFilters ? (
              <>
                No clients match your filters.{' '}
                <button onClick={clearFilters} className="text-blue-600 hover:underline">
                  Clear filters
                </button>
              </>
            ) : (
              <>
                No clients yet.{' '}
                <button onClick={() => setShowAddForm(true)} className="text-blue-600 hover:underline">
                  Add your first client
                </button>
              </>
            )}
          </div>
        ) : (
          paginatedClients.map((client) => (
            <div
              key={client.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 active:bg-gray-50 transition-colors"
              onClick={() => setViewingClient(client)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-700">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{client.name}</p>
                    <p className="text-sm text-gray-500 truncate">{client.company || client.email || 'No details'}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  {getClientTypeBadge(client.client_type)}
                  <Badge variant={client.status === 'Active' ? 'active' : 'inactive'} className="text-[10px]">
                    {client.status || 'Active'}
                  </Badge>
                </div>
              </div>
              
              {/* Quick Info */}
              {(client.phone || client.email) && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                  {client.phone && <span>{client.phone}</span>}
                  {client.email && <span className="truncate">{client.email}</span>}
                </div>
              )}
              
              {/* Actions */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingClient(client)}
                  className="flex-1 h-9 text-sm"
                >
                  <Eye className="h-4 w-4 mr-1.5" weight="fill" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingClient(client)}
                  className="flex-1 h-9 text-sm"
                >
                  <PencilSimple className="h-4 w-4 mr-1.5" weight="fill" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeletingClient(client)}
                  className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:border-red-300"
                >
                  <Trash className="h-4 w-4" weight="fill" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Clients Table - Desktop */}
      <div className="hidden md:block bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('name')}
                >
                  Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('email')}
                >
                  Email {sortField === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('company')}
                >
                  Company {sortField === 'company' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('client_type')}
                >
                  Type {sortField === 'client_type' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    {hasActiveFilters ? (
                      <>
                        No clients match your filters.{' '}
                        <button onClick={clearFilters} className="text-blue-600 hover:underline">
                          Clear filters
                        </button>
                      </>
                    ) : (
                      <>
                        No clients yet.{' '}
                        <button onClick={() => setShowAddForm(true)} className="text-blue-600 hover:underline">
                          Add your first client
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setViewingClient(client)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-700">
                            {client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {client.company || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getClientTypeBadge(client.client_type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={client.status === 'Active' ? 'active' : 'inactive'}>
                        {client.status || 'Active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingClient(client)}
                          className="h-9 w-9 p-0"
                          title="View details"
                        >
                          <Eye className="h-5 w-5" weight="fill" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingClient(client)}
                          className="h-9 w-9 p-0"
                          title="Edit client"
                        >
                          <PencilSimple className="h-5 w-5" weight="fill" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingClient(client)}
                          className="h-9 w-9 p-0 text-red-600 hover:text-red-700"
                          title="Delete client"
                        >
                          <Trash className="h-5 w-5" weight="fill" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm px-4 py-3 sm:px-6 sm:py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs sm:text-sm text-gray-700 order-2 sm:order-1">
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredAndSortedClients.length)} of{' '}
            {filteredAndSortedClients.length}
          </div>
          <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex-1 sm:flex-none"
            >
              Prev
            </Button>
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <span className="sm:hidden flex items-center text-sm text-gray-500">
              {currentPage} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex-1 sm:flex-none"
            >
              Next
            </Button>
          </div>
        </div>
      )}

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

      {/* Delete Confirmation */}
      {deletingClient && (
        <AlertDialog open={!!deletingClient} onOpenChange={(open) => !open && setDeletingClient(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Client</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{deletingClient.name}</strong>? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={async () => {
                  await deleteClient(deletingClient.id);
                  setDeletingClient(null);
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
