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
  created_at: string;
  updated_at: string;
}

export function exportToCSV(clients: Client[]) {
  const headers = ['Name', 'Email', 'Phone', 'Address', 'Company', 'Status', 'Created At'];
  const rows = clients.map(client => [
    client.name,
    client.email || '',
    client.phone || '',
    client.address || '',
    client.company || '',
    client.status || 'Active',
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
  const headers = ['Name', 'Email', 'Phone', 'Address', 'Company', 'Status', 'Created At'];
  const rows = clients.map(client => [
    client.name,
    client.email || '',
    client.phone || '',
    client.address || '',
    client.company || '',
    client.status || 'Active',
    new Date(client.created_at).toLocaleDateString(),
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Clients');
  
  XLSX.writeFile(workbook, `clients_${new Date().toISOString().split('T')[0]}.xlsx`);
}

export function exportToPDF(clients: Client[]) {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Client Database', 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, 14, 30);

  // @ts-ignore - jspdf-autotable extends jsPDF
  doc.autoTable({
    head: [['Name', 'Email', 'Phone', 'Company', 'Status']],
    body: clients.map(client => [
      client.name,
      client.email || '-',
      client.phone || '-',
      client.company || '-',
      client.status || 'Active',
    ]),
    startY: 35,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`clients_${new Date().toISOString().split('T')[0]}.pdf`);
}


