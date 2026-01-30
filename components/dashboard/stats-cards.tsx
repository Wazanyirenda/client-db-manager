"use client";

import { Client } from '@/lib/hooks/use-clients';
import { Users, UserCheck, UserMinus, CurrencyDollar, Target, Database } from '@phosphor-icons/react';

interface StatsCardsProps {
  clients: Client[];
}

export function StatsCards({ clients }: StatsCardsProps) {
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const inactiveClients = clients.filter(c => c.status === 'Inactive').length;
  
  // Client type counts
  const leadClients = clients.filter(c => c.client_type === 'Lead').length;
  const dataClients = clients.filter(c => c.client_type === 'Data').length;
  const payingClients = clients.filter(c => c.client_type === 'Paying').length;

  const stats = [
    {
      label: 'Total Clients',
      value: totalClients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Active',
      value: activeClients,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Inactive',
      value: inactiveClients,
      icon: UserMinus,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
    },
    {
      label: 'Leads',
      value: leadClients,
      icon: Target,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Data',
      value: dataClients,
      icon: Database,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Paying Clients',
      value: payingClients,
      icon: CurrencyDollar,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-5 w-5 ${stat.color}`} weight="fill" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-xs font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
