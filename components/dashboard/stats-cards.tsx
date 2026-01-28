"use client";

import { Client } from '@/lib/hooks/use-clients';
import { Users, UserCheck, UserX, Calendar } from 'lucide-react';

interface StatsCardsProps {
  clients: Client[];
}

export function StatsCards({ clients }: StatsCardsProps) {
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'Active').length;
  const inactiveClients = clients.filter(c => c.status === 'Inactive').length;
  
  const thisMonth = new Date();
  thisMonth.setDate(1);
  const clientsThisMonth = clients.filter(
    c => new Date(c.created_at) >= thisMonth
  ).length;

  const stats = [
    {
      label: 'Total Clients',
      value: totalClients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Active Clients',
      value: activeClients,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Inactive Clients',
      value: inactiveClients,
      icon: UserX,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      label: 'Added This Month',
      value: clientsThisMonth,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
