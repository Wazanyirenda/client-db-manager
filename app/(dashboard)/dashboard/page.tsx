'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useClients, Client } from '@/lib/hooks/use-clients';
import { useTasks } from '@/lib/hooks/use-tasks';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  UserCheck,
  CheckSquare,
  Warning,
  Plus,
  ArrowRight,
  Clock,
  CurrencyDollar,
  TrendingUp,
  Calendar,
} from '@phosphor-icons/react';

export default function DashboardPage() {
  const { clients, loading: clientsLoading } = useClients();
  const { tasks, loading: tasksLoading } = useTasks();

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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of your client management</p>
        </div>
        <div className="flex gap-2">
          <Link href="/clients">
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" weight="fill" />
              View Clients
            </Button>
          </Link>
          <Link href="/clients?add=true">
            <Button>
              <Plus className="h-4 w-4 mr-2" weight="bold" />
              Add Client
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Clients"
          value={stats.total}
          icon={Users}
          color="blue"
          subtitle={`${stats.active} active`}
        />
        <StatCard
          title="Active Leads"
          value={stats.leads}
          icon={TrendingUp}
          color="amber"
          subtitle="In pipeline"
        />
        <StatCard
          title="Paying Clients"
          value={stats.paying}
          icon={UserCheck}
          color="emerald"
          subtitle={`$${stats.totalDealValue.toLocaleString()} total value`}
        />
        <StatCard
          title="Tasks Due Today"
          value={stats.tasksDueToday}
          icon={CheckSquare}
          color="purple"
          subtitle={stats.overdueTasks > 0 ? `${stats.overdueTasks} overdue` : 'All on track'}
          alert={stats.overdueTasks > 0}
        />
      </div>

      {/* Alerts */}
      {(stats.overdueTasks > 0 || stats.overdueInvoices > 0) && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <Warning className="h-5 w-5 text-red-500 flex-shrink-0" weight="fill" />
          <div className="text-sm text-red-700">
            {stats.overdueTasks > 0 && (
              <span>
                You have <strong>{stats.overdueTasks}</strong> overdue task{stats.overdueTasks > 1 ? 's' : ''}.
              </span>
            )}
            {stats.overdueTasks > 0 && stats.overdueInvoices > 0 && ' '}
            {stats.overdueInvoices > 0 && (
              <span>
                <strong>{stats.overdueInvoices}</strong> invoice{stats.overdueInvoices > 1 ? 's' : ''} past due.
              </span>
            )}
          </div>
          <Link href="/tasks" className="ml-auto">
            <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
              View Tasks
            </Button>
          </Link>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <TrendingUp className="h-4 w-4 mr-2" weight="fill" />
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

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  alert,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: 'blue' | 'amber' | 'emerald' | 'purple';
  subtitle?: string;
  alert?: boolean;
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  };

  const iconBgClasses = {
    blue: 'bg-blue-100',
    amber: 'bg-amber-100',
    emerald: 'bg-emerald-100',
    purple: 'bg-purple-100',
  };

  return (
    <div className={`rounded-lg border p-5 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
          {subtitle && (
            <p className={`text-xs mt-1 ${alert ? 'text-red-600 font-medium' : 'opacity-70'}`}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={`h-12 w-12 rounded-lg ${iconBgClasses[color]} flex items-center justify-center`}>
          <Icon className="h-6 w-6" weight="fill" />
        </div>
      </div>
    </div>
  );
}
