"use client";

import { Client } from "@/lib/hooks/use-clients";

interface QuickSummaryProps {
  clients: Client[];
}

export function QuickSummary({ clients }: QuickSummaryProps) {
  const payingClients = clients.filter((client) => client.client_type === "Paying").length;
  const leadClients = clients.filter((client) => client.client_type === "Lead").length;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const staleClients = clients.filter((client) => {
    if (!client.last_contact) return true;
    return new Date(client.last_contact) < thirtyDaysAgo;
  }).length;

  const lastActivityTime = clients.reduce((latest, client) => {
    const updated = new Date(client.updated_at || client.created_at).getTime();
    return Math.max(latest, updated);
  }, 0);

  const lastActivity =
    lastActivityTime > 0
      ? new Date(lastActivityTime).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "No activity yet";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      {clients.length === 0 ? (
        <div className="text-sm text-gray-600">
          Start by adding your first client to see personalized insights.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-sm text-gray-700">
            You have{" "}
            <span className="font-semibold text-gray-900">{payingClients} paying clients</span>{" "}
            and{" "}
            <span className="font-semibold text-gray-900">{leadClients} leads</span>{" "}
            to follow up.
          </div>
          <div className="text-sm text-gray-700">
            <span className="font-semibold text-gray-900">{staleClients} clients</span>{" "}
            haven't been contacted in 30+ days.
          </div>
          <div className="text-sm text-gray-700">
            Last activity: <span className="font-semibold text-gray-900">{lastActivity}</span>
          </div>
        </div>
      )}
    </div>
  );
}

