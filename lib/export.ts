import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  company: string | null;
  status: string | null;
  client_type: string | null;
  website: string | null;
  notes: string | null;
  source: string | null;
  last_contact: string | null;
  created_at: string;
  updated_at: string;
}

export function exportToCSV(clients: Client[]) {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Website', 'Address', 'Type', 'Status', 'Source', 'Notes', 'Last Contact', 'Created At'];
  const rows = clients.map(client => [
    client.name,
    client.email || '',
    client.phone || '',
    client.company || '',
    client.website || '',
    client.address || '',
    client.client_type || 'Lead',
    client.status || 'Active',
    client.source || '',
    client.notes || '',
    client.last_contact ? new Date(client.last_contact).toLocaleDateString() : '',
    new Date(client.created_at).toLocaleDateString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `clients_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(clients: Client[]) {
  const headers = ['Name', 'Email', 'Phone', 'Company', 'Website', 'Address', 'Type', 'Status', 'Source', 'Notes', 'Last Contact', 'Created At'];
  const rows = clients.map(client => [
    client.name,
    client.email || '',
    client.phone || '',
    client.company || '',
    client.website || '',
    client.address || '',
    client.client_type || 'Lead',
    client.status || 'Active',
    client.source || '',
    client.notes || '',
    client.last_contact ? new Date(client.last_contact).toLocaleDateString() : '',
    new Date(client.created_at).toLocaleDateString(),
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 20 }, // Name
    { wch: 25 }, // Email
    { wch: 15 }, // Phone
    { wch: 20 }, // Company
    { wch: 25 }, // Website
    { wch: 30 }, // Address
    { wch: 10 }, // Type
    { wch: 10 }, // Status
    { wch: 15 }, // Source
    { wch: 40 }, // Notes
    { wch: 12 }, // Last Contact
    { wch: 12 }, // Created At
  ];
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
  
  XLSX.writeFile(workbook, `clients_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportToPDF(clients: Client[]) {
  const doc = new jsPDF('landscape');
  
  doc.setFontSize(18);
  doc.text('Client Database', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()} | Total: ${clients.length} clients`, 14, 30);

  // @ts-ignore - jspdf-autotable extends jsPDF
  doc.autoTable({
    head: [['Name', 'Email', 'Phone', 'Company', 'Type', 'Status', 'Source']],
    body: clients.map(client => [
      client.name,
      client.email || '-',
      client.phone || '-',
      client.company || '-',
      client.client_type || 'Lead',
      client.status || 'Active',
      client.source || '-',
    ]),
    startY: 35,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`clients_${new Date().toISOString().split('T')[0]}.pdf`);
}
