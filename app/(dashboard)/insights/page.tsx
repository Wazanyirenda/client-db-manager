'use client';

import { useMemo } from 'react';
import { useClients } from '@/lib/hooks/use-clients';
import { useTasks } from '@/lib/hooks/use-tasks';
import { useCurrency } from '@/lib/hooks/use-currency';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { QuickSummary } from '@/components/dashboard/quick-summary';
import { Badge } from '@/components/ui/badge';
import { InsightsSkeleton } from '@/components/ui/loading';
import {
  ChartBar,
  Users,
  CurrencyDollar,
  TrendUp,
  TrendDown,
  Clock,
  CheckCircle,
  Warning,
  Calendar,
  Target,
} from '@phosphor-icons/react';

export default function InsightsPage() {
  const { clients, loading: clientsLoading } = useClients();
  const { tasks, loading: tasksLoading } = useTasks();
  const { formatAmount } = useCurrency();

  // Calculate detailed stats
  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    // Client stats
    const totalClients = clients.length;
    const activeClients = clients.filter((c) => c.status === 'Active').length;
    const inactiveClients = clients.filter((c) => c.status === 'Inactive').length;
    const leadsCount = clients.filter((c) => c.client_type === 'Lead').length;
    const payingCount = clients.filter((c) => c.client_type === 'Paying').length;
    const dataCount = clients.filter((c) => c.client_type === 'Data').length;

    // This month stats
    const addedThisMonth = clients.filter(
      (c) => new Date(c.created_at) >= thisMonth
    ).length;
    const addedLastMonth = clients.filter((c) => {
      const date = new Date(c.created_at);
      return date >= lastMonth && date <= lastMonthEnd;
    }).length;

    // Revenue stats
    const totalPipelineValue = clients
      .filter((c) => c.deal_value && c.pipeline_stage !== 'Lost')
      .reduce((sum, c) => sum + (Number(c.deal_value) || 0), 0);
    const wonDealsValue = clients
      .filter((c) => c.deal_value && c.pipeline_stage === 'Won')
      .reduce((sum, c) => sum + (Number(c.deal_value) || 0), 0);
    const lostDealsValue = clients
      .filter((c) => c.deal_value && c.pipeline_stage === 'Lost')
      .reduce((sum, c) => sum + (Number(c.deal_value) || 0), 0);

    // Pipeline stats
    const pipelineByStage = {
      Inquiry: clients.filter((c) => c.pipeline_stage === 'Inquiry').length,
      Contacted: clients.filter((c) => c.pipeline_stage === 'Contacted').length,
      Proposal: clients.filter((c) => c.pipeline_stage === 'Proposal').length,
      Won: clients.filter((c) => c.pipeline_stage === 'Won').length,
      Lost: clients.filter((c) => c.pipeline_stage === 'Lost').length,
    };

    // Follow-up stats
    const overdueFollowUps = clients.filter((c) => {
      if (!c.next_follow_up || ['Won', 'Lost'].includes(c.pipeline_stage || '')) return false;
      return new Date(c.next_follow_up) < now;
    }).length;
    const upcomingFollowUps = clients.filter((c) => {
      if (!c.next_follow_up || ['Won', 'Lost'].includes(c.pipeline_stage || '')) return false;
      const followUp = new Date(c.next_follow_up);
      return followUp >= now && followUp <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }).length;

    // Contact stats
    const noContactIn30Days = clients.filter((c) => {
      if (!c.last_contact) return true;
      const lastContact = new Date(c.last_contact);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return lastContact < thirtyDaysAgo;
    }).length;

    // Task stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.completed).length;
    const pendingTasks = tasks.filter((t) => !t.completed).length;
    const overdueTasks = tasks.filter((t) => {
      if (!t.due_at || t.completed) return false;
      return new Date(t.due_at) < now;
    }).length;

    // Invoice stats
    const unpaidInvoices = clients.filter((c) => c.invoice_status === 'Unpaid').length;
    const paidInvoices = clients.filter((c) => c.invoice_status === 'Paid').length;
    const overdueInvoices = clients.filter((c) => {
      if (!c.invoice_due_date || c.invoice_status === 'Paid') return false;
      return new Date(c.invoice_due_date) < now;
    }).length;

    return {
      totalClients,
      activeClients,
      inactiveClients,
      leadsCount,
      payingCount,
      dataCount,
      addedThisMonth,
      addedLastMonth,
      totalPipelineValue,
      wonDealsValue,
      lostDealsValue,
      pipelineByStage,
      overdueFollowUps,
      upcomingFollowUps,
      noContactIn30Days,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      unpaidInvoices,
      paidInvoices,
      overdueInvoices,
    };
  }, [clients, tasks]);

  const loading = clientsLoading || tasksLoading;

  if (loading) {
    return <InsightsSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ChartBar className="h-7 w-7 text-blue-600" weight="fill" />
          Insights
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your client data and business metrics
        </p>
      </div>

      {/* Quick Summary */}
      <QuickSummary clients={clients} />

      {/* Main Stats */}
      <StatsCards clients={clients} />

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Client Breakdown */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" weight="fill" />
            Client Breakdown
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Clients</span>
              <span className="font-semibold text-gray-900">{stats.totalClients}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active</span>
              <Badge className="bg-emerald-100 text-emerald-700">{stats.activeClients}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Inactive</span>
              <Badge className="bg-gray-100 text-gray-700">{stats.inactiveClients}</Badge>
            </div>
            <hr className="border-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Paying Clients</span>
              <Badge className="bg-emerald-100 text-emerald-700">{stats.payingCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Leads</span>
              <Badge className="bg-amber-100 text-amber-700">{stats.leadsCount}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Data Entries</span>
              <Badge className="bg-gray-100 text-gray-700">{stats.dataCount}</Badge>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CurrencyDollar className="h-5 w-5 text-emerald-600" weight="fill" />
            Revenue
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pipeline Value</span>
              <span className="font-semibold text-gray-900">
                {formatAmount(stats.totalPipelineValue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <TrendUp className="h-4 w-4 text-emerald-500" weight="bold" />
                Won Deals
              </span>
              <span className="font-semibold text-emerald-600">
                {formatAmount(stats.wonDealsValue)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <TrendDown className="h-4 w-4 text-red-500" weight="bold" />
                Lost Deals
              </span>
              <span className="font-semibold text-red-600">
                {formatAmount(stats.lostDealsValue)}
              </span>
            </div>
            <hr className="border-gray-200" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Paid Invoices</span>
              <Badge className="bg-emerald-100 text-emerald-700">{stats.paidInvoices}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Unpaid Invoices</span>
              <Badge className="bg-amber-100 text-amber-700">{stats.unpaidInvoices}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overdue Invoices</span>
              <Badge className="bg-red-100 text-red-700">{stats.overdueInvoices}</Badge>
            </div>
          </div>
        </div>

        {/* Pipeline */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" weight="fill" />
            Pipeline
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Inquiry</span>
              <Badge className="bg-gray-100 text-gray-700">{stats.pipelineByStage.Inquiry}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Contacted</span>
              <Badge className="bg-blue-100 text-blue-700">{stats.pipelineByStage.Contacted}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Proposal</span>
              <Badge className="bg-amber-100 text-amber-700">{stats.pipelineByStage.Proposal}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Won</span>
              <Badge className="bg-emerald-100 text-emerald-700">{stats.pipelineByStage.Won}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lost</span>
              <Badge className="bg-red-100 text-red-700">{stats.pipelineByStage.Lost}</Badge>
            </div>
          </div>
        </div>

        {/* Follow-ups */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-600" weight="fill" />
            Follow-ups
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Warning className="h-4 w-4 text-red-500" weight="fill" />
                Overdue
              </span>
              <Badge className="bg-red-100 text-red-700">{stats.overdueFollowUps}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="h-4 w-4 text-amber-500" weight="fill" />
                This Week
              </span>
              <Badge className="bg-amber-100 text-amber-700">{stats.upcomingFollowUps}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">No contact in 30+ days</span>
              <Badge className="bg-gray-100 text-gray-700">{stats.noContactIn30Days}</Badge>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600" weight="fill" />
            Tasks
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Tasks</span>
              <span className="font-semibold text-gray-900">{stats.totalTasks}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <Badge className="bg-emerald-100 text-emerald-700">{stats.completedTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending</span>
              <Badge className="bg-blue-100 text-blue-700">{stats.pendingTasks}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Overdue</span>
              <Badge className="bg-red-100 text-red-700">{stats.overdueTasks}</Badge>
            </div>
          </div>
        </div>

        {/* Growth */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendUp className="h-5 w-5 text-emerald-600" weight="fill" />
            Growth
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Added this month</span>
              <Badge className="bg-blue-100 text-blue-700">{stats.addedThisMonth}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Added last month</span>
              <Badge className="bg-gray-100 text-gray-700">{stats.addedLastMonth}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Month-over-month</span>
              {stats.addedThisMonth >= stats.addedLastMonth ? (
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendUp className="h-4 w-4" weight="bold" />
                  {stats.addedLastMonth > 0
                    ? `+${Math.round(((stats.addedThisMonth - stats.addedLastMonth) / stats.addedLastMonth) * 100)}%`
                    : stats.addedThisMonth > 0
                    ? '+100%'
                    : '0%'}
                </span>
              ) : (
                <span className="text-red-600 font-semibold flex items-center gap-1">
                  <TrendDown className="h-4 w-4" weight="bold" />
                  {Math.round(((stats.addedLastMonth - stats.addedThisMonth) / stats.addedLastMonth) * 100)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
