"use client";

import { useClients } from "@/lib/hooks/use-clients";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

export default function DataSettingsPage() {
  const { clients } = useClients();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Database className="h-4 w-4 text-blue-600" />
        Data
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        Export your data for backups or reporting.
      </p>

      <div className="flex flex-wrap gap-3 mt-4">
        <Button variant="outline" onClick={() => exportToCSV(clients)}>
          Export CSV
        </Button>
        <Button variant="outline" onClick={() => exportToExcel(clients)}>
          Export Excel
        </Button>
        <Button variant="outline" onClick={() => exportToPDF(clients)}>
          Export PDF
        </Button>
      </div>
    </div>
  );
}

