"use client";

import { useClients } from "@/lib/hooks/use-clients";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Database, FileText, FileSpreadsheet, Download } from "lucide-react";

export default function DataSettingsPage() {
  const { clients } = useClients();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Database className="h-5 w-5 text-blue-600" />
        Data Export
      </h2>
      <p className="text-sm text-gray-600 mt-1">
        Export your client data for backups or external reporting.
      </p>

      <div className="mt-6 space-y-4">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <h3 className="font-medium text-gray-900 mb-3">Export Options</h3>
          <p className="text-sm text-gray-600 mb-4">
            You have <strong>{clients.length}</strong> client{clients.length !== 1 ? 's' : ''} that will be included in the export.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => exportToCSV(clients)} className="gap-2">
              <FileText className="h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => exportToExcel(clients)} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </Button>
            <Button variant="outline" onClick={() => exportToPDF(clients)} className="gap-2">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <h3 className="font-medium text-blue-900 mb-2">What's included in exports</h3>
          <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
            <li>Client name, email, phone, company</li>
            <li>Status and client type</li>
            <li>Pipeline stage and deal value</li>
            <li>Invoice status and dates</li>
            <li>Notes and source information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

