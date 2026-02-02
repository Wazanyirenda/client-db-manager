'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useClients, Client } from '@/lib/hooks/use-clients';
import { useTasks } from '@/lib/hooks/use-tasks';
import { useCurrency } from '@/lib/hooks/use-currency';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loading } from '@/components/ui/loading';
import {
  Users,
  UserCheck,
  CheckSquare,
  Warning,
  Plus,
  ArrowRight,
  Clock,
  CurrencyDollar,
  TrendUp,
  Calendar,
} from '@phosphor-icons/react';

export default function DashboardPage() {
  const { clients, loading: clientsLoading } = useClients();
  const { tasks, loading: tasksLoading } = useTasks();
  const { formatAmount } = useCurrency();

  // Calculate stats
  const stats = useMemo(() => {
    const total = clients.length;
    const leads = clients.filter((c) => c.client_type === 'Lead').length;
    const paying = clients.filter((c) => c.client_type === 'Paying').length;
    const active = clients.filter((c) => c.status === 'Active').length;

    const now = new Date();
    const tasksDueToday = tasks.filter((t) => {
      if (!t.due_at || t.completed) return false;
      const due = new Date(t.due_at);
      return (
        due.getFullYear() === now.getFullYear() &&
        due.getMonth() === now.getMonth() &&
        due.getDate() === now.getDate()
      );
    }).length;

    const overdueTasks = tasks.filter((t) => {
      if (!t.due_at || t.completed) return false;
      return new Date(t.due_at) < now;
    }).length;

    const overdueInvoices = clients.filter((c) => {
      if (!c.invoice_due_date || c.invoice_status === 'Paid') return false;
      return new Date(c.invoice_due_date) < now;
    }).length;

    const totalDealValue = clients
      .filter((c) => c.deal_value)
      .reduce((sum, c) => sum + (Number(c.deal_value) || 0), 0);

    return { total, leads, paying, active, tasksDueToday, overdueTasks, overdueInvoices, totalDealValue };
  }, [clients, tasks]);

  // Recent clients (last 5 added)
  const recentClients = useMemo(() => {
    return [...clients]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
  }, [clients]);

  // Upcoming follow-ups
  const upcomingFollowUps = useMemo(() => {
    const now = new Date();
    return clients
      .filter((c) => c.next_follow_up && !['Won', 'Lost'].includes(c.pipeline_stage || ''))
      .sort((a, b) => new Date(a.next_follow_up!).getTime() - new Date(b.next_follow_up!).getTime())
      .slice(0, 5);
  }, [clients]);

  // Tasks due today
  const todaysTasks = useMemo(() => {
    const now = new Date();
    return tasks
      .filter((t) => {
        if (!t.due_at || t.completed) return false;
        const due = new Date(t.due_at);
        return (
          due.getFullYear() === now.getFullYear() &&
          due.getMonth() === now.getMonth() &&
          due.getDate() === now.getDate()
        );
      })
      .slice(0, 5);
  }, [tasks]);

  if (clientsLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading size="md" text="Loading dashboard" showLogo={false} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your client management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/clients" className="flex-1 sm:flex-none">
            <Button variant="outline" className="w-full sm:w-auto">
              <Users className="h-4 w-4 mr-2" weight="fill" />
              <span className="sm:inline">Clients</span>
            </Button>
          </Link>
          <Link href="/clients?add=true" className="flex-1 sm:flex-none">
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" weight="bold" />
              <span className="sm:inline">Add</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Clients"
          value={stats.total}
          icon={Users}
          subtitle={`${stats.active} active`}
        />
        <StatCard
          title="Active Leads"
          value={stats.leads}
          icon={TrendUp}
          subtitle="In pipeline"
        />
        <StatCard
          title="Paying Clients"
          value={stats.paying}
          icon={UserCheck}
          subtitle={`${formatAmount(stats.totalDealValue)} total value`}
        />
        <StatCard
          title="Tasks Due Today"
          value={stats.tasksDueToday}
          icon={CheckSquare}
          subtitle={stats.overdueTasks > 0 ? `${stats.overdueTasks} overdue` : 'All on track'}
          alert={stats.overdueTasks > 0}
        />
      </div>

      {/* Alerts */}
      {(stats.overdueTasks > 0 || stats.overdueInvoices > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Warning className="h-5 w-5 text-red-500 flex-shrink-0" weight="fill" />
            <div className="text-sm text-red-700">
              {stats.overdueTasks > 0 && (
                <span>
                  <strong>{stats.overdueTasks}</strong> overdue task{stats.overdueTasks > 1 ? 's' : ''}.
                </span>
              )}
              {stats.overdueTasks > 0 && stats.overdueInvoices > 0 && ' '}
              {stats.overdueInvoices > 0 && (
                <span>
                  <strong>{stats.overdueInvoices}</strong> invoice{stats.overdueInvoices > 1 ? 's' : ''} past due.
                </span>
              )}
            </div>
          </div>
          <Link href="/tasks">
            <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100 w-full sm:w-auto">
              View
            </Button>
          </Link>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Recent Clients */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Clients</h2>
            <Link href="/clients" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              View all <ArrowRight className="h-3 w-3" weight="bold" />
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentClients.length === 0 ? (
              <div className="px-5 py-8 text-center text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 text-gray-300" weight="regular" />
                <p>No clients yet</p>
                <Link href="/clients?add=true">
                  <Button size="sm" className="mt-3">
                    <Plus className="h-4 w-4 mr-1" weight="bold" />
                    Add your first client
                  </Button>
                </Link>
              </div>
            ) : (
              recentClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/clients?view=${client.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-700">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{client.name}</p>
                      <p className="text-xs text-gray-500">{client.company || client.email || 'No details'}</p>
                    </div>
                  </div>
                  <Badge
                    className={
                      client.client_type === 'Paying'
                        ? 'bg-emerald-100 text-emerald-700'
                        : client.client_type === 'Lead'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }
                  >
                    {client.client_type || 'Data'}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Tasks Due Today */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Today's Tasks</h2>
              <Link href="/tasks" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" weight="bold" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {todaysTasks.length === 0 ? (
                <div className="px-5 py-6 text-center text-gray-500">
                  <CheckSquare className="h-6 w-6 mx-auto mb-2 text-gray-300" weight="regular" />
                  <p className="text-sm">No tasks due today</p>
                </div>
              ) : (
                todaysTasks.map((task) => (
                  <div key={task.id} className="px-5 py-3 flex items-center gap-3">
                    <CheckSquare className="h-4 w-4 text-blue-500 flex-shrink-0" weight="fill" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{task.title}</p>
                      {task.client && (
                        <p className="text-xs text-gray-500">{task.client.name}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Follow-ups */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Upcoming Follow-ups</h2>
              <Link href="/clients" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" weight="bold" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {upcomingFollowUps.length === 0 ? (
                <div className="px-5 py-6 text-center text-gray-500">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-gray-300" weight="regular" />
                  <p className="text-sm">No follow-ups scheduled</p>
                </div>
              ) : (
                upcomingFollowUps.map((client) => (
                  <Link
                    key={client.id}
                    href={`/clients?view=${client.id}`}
                    className="px-5 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors"
                  >
                    <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" weight="fill" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{client.name}</p>
                      <p className="text-xs text-gray-500">
                        {client.next_follow_up
                          ? new Date(client.next_follow_up).toLocaleDateString()
                          : '—'}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/clients?add=true">
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" weight="bold" />
              Add Client
            </Button>
          </Link>
          <Link href="/tasks">
            <Button variant="outline">
              <CheckSquare className="h-4 w-4 mr-2" weight="fill" />
              Create Task
            </Button>
          </Link>
          <Link href="/pipeline">
            <Button variant="outline">
              <TrendUp className="h-4 w-4 mr-2" weight="fill" />
              View Pipeline
            </Button>
          </Link>
          <Link href="/settings/data">
            <Button variant="outline">
              <CurrencyDollar className="h-4 w-4 mr-2" weight="fill" />
              Export Data
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component - Uniform professional blue style
function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  alert,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  subtitle?: string;
  alert?: boolean;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 sm:p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-0.5 sm:mt-1">{value}</p>
          {subtitle && (
            <p className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 truncate ${alert ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" weight="fill" />
        </div>
      </div>
    </div>
  );
}
