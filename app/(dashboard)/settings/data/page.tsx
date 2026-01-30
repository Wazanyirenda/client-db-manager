"use client";

import { useClients } from "@/lib/hooks/use-clients";
import { useActivityLog } from "@/lib/hooks/use-activity-log";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Database, FileText, FileXls, DownloadSimple, HardDrive, Users, Calendar, FilePdf } from "@phosphor-icons/react";

export default function DataSettingsPage() {
  const { clients } = useClients();
  const { logDataExported } = useActivityLog();

  const payingClients = clients.filter(c => c.client_type === 'Paying').length;
  const leads = clients.filter(c => c.client_type === 'Lead').length;
  const thisMonth = clients.filter(c => {
    const date = new Date(c.created_at);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const handleExport = async (format: 'csv' | 'excel' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV(clients);
    } else if (format === 'excel') {
      exportToExcel(clients);
    } else {
      exportToPDF(clients);
    }
    // Log the export activity
    await logDataExported(format, clients.length);
  };

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <HardDrive className="h-4 w-4 text-blue-600" weight="fill" />
            Data Overview
          </h3>
          <p className="text-sm text-gray-500 mt-1">Summary of your stored data.</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" weight="fill" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">{clients.length}</div>
                  <div className="text-xs text-blue-600">Total Clients</div>
                </div>
              </div>
            </div>
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-600" weight="fill" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-700">{payingClients}</div>
                  <div className="text-xs text-emerald-600">Paying Clients</div>
                </div>
              </div>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-600" weight="fill" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-700">{thisMonth}</div>
                  <div className="text-xs text-amber-600">Added This Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <DownloadSimple className="h-4 w-4 text-blue-600" weight="fill" />
            Export Your Data
          </h3>
          <p className="text-sm text-gray-500 mt-1">Download your client data in various formats.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
            >
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <FileText className="h-6 w-6 text-blue-600" weight="fill" />
              </div>
              <div>
                <div className="font-medium text-gray-900">CSV Format</div>
                <div className="text-xs text-gray-500">Comma-separated values</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
            >
              <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <FileXls className="h-6 w-6 text-emerald-600" weight="fill" />
              </div>
              <div>
                <div className="font-medium text-gray-900">Excel Format</div>
                <div className="text-xs text-gray-500">Microsoft Excel (.xlsx)</div>
              </div>
            </button>

            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group text-left"
            >
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <FilePdf className="h-6 w-6 text-red-600" weight="fill" />
              </div>
              <div>
                <div className="font-medium text-gray-900">PDF Format</div>
                <div className="text-xs text-gray-500">Portable Document Format</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* What's Included */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-900 flex items-center gap-2 mb-3">
          <Database className="h-4 w-4" weight="fill" />
          What's Included in Exports
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <ul className="space-y-1">
            <li>- Client name, email, phone</li>
            <li>- Company and website</li>
            <li>- Status and client type</li>
          </ul>
          <ul className="space-y-1">
            <li>- Pipeline stage and deal value</li>
            <li>- Invoice status and dates</li>
            <li>- Notes and source information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
