'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useClients, useProfile, Client, ClientType } from '@/lib/hooks/use-clients';
import { useTasks } from '@/lib/hooks/use-tasks';
import { exportToCSV, exportToExcel, exportToPDF } from '@/lib/export';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { QuickSummary } from '@/components/dashboard/quick-summary';
import { UserAvatar } from '@/components/dashboard/user-avatar';
import { ClientForm } from '@/components/clients/client-form';
import { ClientDialog } from '@/components/clients/client-dialog';
import { ClientDetailsModal } from '@/components/clients/client-details-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Edit, Trash2, Download, Search, LogOut, Plus, Eye, Settings, Users, CalendarCheck2, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

type SortField = 'name' | 'email' | 'company' | 'status' | 'client_type' | 'created_at';
type SortDirection = 'asc' | 'desc';

export default function Home() {
  const router = useRouter();
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
  const { profile } = useProfile();
  const { tasks, loading: tasksLoading, createTask, setTaskCompleted, deleteTask } = useTasks();

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

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
  const [activeTab, setActiveTab] = useState<'clients' | 'today' | 'insights'>('clients');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Today view: tasks + follow-ups
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskClientId, setNewTaskClientId] = useState<string>('none');
  const [newTaskDueAt, setNewTaskDueAt] = useState('');

  // CSV import
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let filtered = clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.website?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus =
        statusFilter === 'all' || client.status === statusFilter;

      const matchesType =
        typeFilter === 'all' || client.client_type === typeFilter;

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

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('dashboard_default_tab') : null;
    if (stored === 'clients' || stored === 'today' || stored === 'insights') {
      setActiveTab(stored);
    }
  }, []);

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

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const getClientTypeBadge = (type: ClientType | null) => {
    switch (type) {
      case 'Paying':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Paying</Badge>;
      case 'Lead':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Lead</Badge>;
      case 'Data':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200">Data</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">-</Badge>;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
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
    // Expected headers (case-insensitive): name, email, phone, company, website, address, source, notes, status, client_type, pipeline_stage, next_follow_up, deal_value, invoice_status, invoice_due_date
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserAvatar name={profile?.full_name} size={44} />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {getGreeting()}, {profile?.full_name || 'there'}!
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {profile?.company_name || profile?.industry
                    ? [profile?.company_name, profile?.industry].filter(Boolean).join(' - ')
                    : 'Manage your client information and relationships'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Client
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  await handleImportCSV(file);
                  // reset so re-selecting same file triggers change
                  e.currentTarget.value = '';
                }}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border border-gray-200 rounded-md shadow-lg p-1 min-w-[120px]">
                  <DropdownMenuItem
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded text-gray-700"
                  >
                    Import CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport('csv')}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded text-gray-700"
                  >
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport('excel')}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded text-gray-700"
                  >
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExport('pdf')}
                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded text-gray-700"
                  >
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={() => router.push('/settings/profile')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside
            className={`bg-white border border-gray-200 rounded-lg p-4 h-fit shadow-sm ${sidebarCollapsed ? 'w-16' : 'w-60'}`}
          >
            <div className="flex items-center justify-between mb-4">
              {!sidebarCollapsed && (
                <span className="text-sm font-semibold text-gray-700">Workspace</span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed((v) => !v)}
                className="h-8 w-8 p-0"
                title={sidebarCollapsed ? 'Expand' : 'Collapse'}
              >
                {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveTab('clients')}
                className={`${
                  activeTab === 'clients'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'text-gray-700'
                } ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start gap-2'}`}
              >
                <Users className="h-4 w-4" />
                {!sidebarCollapsed && 'Clients'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab('today')}
                className={`${
                  activeTab === 'today'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'text-gray-700'
                } ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start gap-2'}`}
              >
                <CalendarCheck2 className="h-4 w-4" />
                {!sidebarCollapsed && 'Today'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setActiveTab('insights')}
                className={`${
                  activeTab === 'insights'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'text-gray-700'
                } ${sidebarCollapsed ? 'justify-center px-2' : 'justify-start gap-2'}`}
              >
                <BarChart3 className="h-4 w-4" />
                {!sidebarCollapsed && 'Insights'}
              </Button>
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Today */}
            {activeTab === 'today' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200 border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Today</h2>
              <p className="text-sm text-gray-600 mt-1">
                Tasks due and clients needing follow-up
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
            {/* Tasks */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Tasks</h3>
              <div className="flex flex-col md:flex-row gap-2 mb-3">
                <Input
                  placeholder="New task..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Select value={newTaskClientId} onValueChange={setNewTaskClientId}>
                  <SelectTrigger className="md:w-[220px]">
                    <SelectValue placeholder="Link to client (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No client</SelectItem>
                    {clients.slice(0, 100).map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="datetime-local"
                  value={newTaskDueAt}
                  onChange={(e) => setNewTaskDueAt(e.target.value)}
                  className="md:w-[220px]"
                />
                <Button
                  onClick={async () => {
                    if (!newTaskTitle.trim()) return;
                    await createTask({
                      title: newTaskTitle.trim(),
                      client_id: newTaskClientId === 'none' ? null : newTaskClientId,
                      due_at: newTaskDueAt || undefined,
                    });
                    setNewTaskTitle('');
                    setNewTaskClientId('none');
                    setNewTaskDueAt('');
                  }}
                >
                  Add
                </Button>
              </div>

              <div className="space-y-2">
                {tasksLoading ? (
                  <p className="text-sm text-gray-500">Loading tasks...</p>
                ) : tasks.length === 0 ? (
                  <p className="text-sm text-gray-500">No tasks yet.</p>
                ) : (
                  tasks.slice(0, 8).map((t) => (
                    <div key={t.id} className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-3 py-2">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={t.completed}
                          onChange={async (e) => setTaskCompleted(t.id, e.target.checked)}
                          className="mt-1"
                        />
                        <div>
                          <div className={`text-sm ${t.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                            {t.title}
                          </div>
                          <div className="text-xs text-gray-500">
                            {t.client?.name ? `${t.client.name} • ` : ''}
                            {t.due_at ? new Date(t.due_at).toLocaleString() : 'No due date'}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={async () => deleteTask(t.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Follow-ups */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Follow-ups due</h3>
              {(() => {
                const now = new Date();
                const due = clients
                  .filter((c) => c.next_follow_up)
                  .filter((c) => new Date(c.next_follow_up as string) <= now)
                  .filter((c) => !['Won', 'Lost'].includes(c.pipeline_stage || ''))
                  .sort((a, b) => new Date(a.next_follow_up as string).getTime() - new Date(b.next_follow_up as string).getTime())
                  .slice(0, 8);

                if (due.length === 0) {
                  return <p className="text-sm text-gray-500">No follow-ups due.</p>;
                }

                return (
                  <div className="space-y-2">
                    {due.map((c) => (
                      <div
                        key={c.id}
                        className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="text-sm text-gray-900 truncate">{c.name}</div>
                          <div className="text-xs text-gray-500">
                            {c.pipeline_stage || 'Inquiry'} • Follow-up: {c.next_follow_up ? new Date(c.next_follow_up).toLocaleString() : '—'}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => setViewingClient(c)}>
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={async () => {
                              await updateLastContact(c.id);
                            }}
                          >
                            Log contact
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
              </div>
            )}

            {/* Insights */}
            {activeTab === 'insights' && (
              <>
                <QuickSummary clients={clients} />
                <StatsCards clients={clients} />
              </>
            )}

            {/* Add Client Form */}
            {activeTab === 'clients' && showAddForm && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Add New Client
                </h2>
                <ClientForm
                  onSubmit={async (data) => {
                    await createClient(data);
                    setShowAddForm(false);
                  }}
                  onCancel={() => setShowAddForm(false)}
                />
              </div>
            )}

            {/* Search and Filters */}
            {activeTab === 'clients' && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
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
                  <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={(value) => { setTypeFilter(value); setCurrentPage(1); }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Lead">Leads</SelectItem>
                      <SelectItem value="Data">Data</SelectItem>
                      <SelectItem value="Paying">Paying Clients</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value: string) => {
                      setPageSize(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="25">25 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                      <SelectItem value="100">100 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Clients Table */}
            {activeTab === 'clients' && (
              <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
              <div className="overflow-x-auto">
                <table className="w-full">
              <thead className="bg-gray-50">
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
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No clients found. {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' ? 'Try adjusting your filters.' : 'Add your first client to get started.'}
                    </td>
                  </tr>
                ) : (
                  paginatedClients.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setViewingClient(client)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {client.name}
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
                        <Badge
                          variant={client.status === 'Active' ? 'active' : 'inactive'}
                        >
                          {client.status || 'Active'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setViewingClient(client)}
                            className="h-8 w-8 p-0"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingClient(client)}
                            className="h-8 w-8 p-0"
                            title="Edit client"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeletingClient(client)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            title="Delete client"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredAndSortedClients.length)} of{' '}
                {filteredAndSortedClients.length} clients
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
                  </div>
                )}
              </div>
            )}
          </div>
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
