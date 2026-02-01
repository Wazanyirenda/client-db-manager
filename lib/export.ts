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
  pipeline_stage: string | null;
  next_follow_up: string | null;
  deal_value: number | null;
  invoice_status: string | null;
  invoice_due_date: string | null;
  billing_type: string | null;
  billing_frequency: string | null;
  recurring_amount: number | null;
  next_billing_date: string | null;
  services: string | null;
  created_at: string;
  updated_at: string;
}

export function exportToCSV(clients: Client[]) {
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Company',
    'Website',
    'Address',
    'Type',
    'Status',
    'Stage',
    'Next Follow-up',
    'Deal Value',
    'Invoice Status',
    'Invoice Due Date',
    'Source',
    'Notes',
    'Last Contact',
    'Created At',
  ];
  const rows = clients.map(client => [
    client.name,
    client.email || '',
    client.phone || '',
    client.company || '',
    client.website || '',
    client.address || '',
    client.client_type || 'Lead',
    client.status || 'Active',
    client.pipeline_stage || 'Inquiry',
    client.next_follow_up ? new Date(client.next_follow_up).toLocaleString() : '',
    client.deal_value ?? '',
    client.invoice_status || 'Unpaid',
    client.invoice_due_date || '',
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
  const headers = [
    'Name',
    'Email',
    'Phone',
    'Company',
    'Website',
    'Address',
    'Type',
    'Status',
    'Stage',
    'Next Follow-up',
    'Deal Value',
    'Invoice Status',
    'Invoice Due Date',
    'Source',
    'Notes',
    'Last Contact',
    'Created At',
  ];
  const rows = clients.map(client => [
    client.name,
    client.email || '',
    client.phone || '',
    client.company || '',
    client.website || '',
    client.address || '',
    client.client_type || 'Lead',
    client.status || 'Active',
    client.pipeline_stage || 'Inquiry',
    client.next_follow_up ? new Date(client.next_follow_up).toLocaleString() : '',
    client.deal_value ?? '',
    client.invoice_status || 'Unpaid',
    client.invoice_due_date || '',
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
    { wch: 12 }, // Stage
    { wch: 22 }, // Next Follow-up
    { wch: 12 }, // Deal Value
    { wch: 14 }, // Invoice Status
    { wch: 14 }, // Invoice Due Date
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
    head: [['Name', 'Email', 'Phone', 'Company', 'Type', 'Status', 'Stage', 'Invoice', 'Source']],
    body: clients.map(client => [
      client.name,
      client.email || '-',
      client.phone || '-',
      client.company || '-',
      client.client_type || 'Lead',
      client.status || 'Active',
      client.pipeline_stage || 'Inquiry',
      client.invoice_status || 'Unpaid',
      client.source || '-',
    ]),
    startY: 35,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [37, 99, 235] },
    alternateRowStyles: { fillColor: [245, 245, 245] },
  });

  doc.save(`clients_${new Date().toISOString().split('T')[0]}.pdf`);
}

export function exportClientInvoice(client: Client) {
  const doc = new jsPDF();
  const today = new Date();

  const formatCurrency = (value: number | null) => {
    if (value === null || Number.isNaN(value)) return '-';
    return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(value);
  };

  doc.setFontSize(18);
  doc.text('Invoice', 14, 20);

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on ${today.toLocaleDateString()}`, 14, 28);

  doc.setTextColor(20);
  doc.setFontSize(12);
  doc.text(`Client: ${client.name}`, 14, 40);
  doc.text(`Email: ${client.email || '-'}`, 14, 48);
  doc.text(`Company: ${client.company || '-'}`, 14, 56);

  const details = [
    ['Billing Type', client.billing_type || 'One-time'],
    ['Billing Frequency', client.billing_frequency || '-'],
    ['Recurring Amount', formatCurrency(client.recurring_amount)],
    ['Next Billing Date', client.next_billing_date || '-'],
    ['Deal Value', formatCurrency(client.deal_value)],
    ['Invoice Status', client.invoice_status || 'Unpaid'],
    ['Invoice Due Date', client.invoice_due_date || '-'],
  ];

  // @ts-ignore - jspdf-autotable extends jsPDF
  doc.autoTable({
    head: [['Field', 'Value']],
    body: details,
    startY: 65,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235] },
    columnStyles: { 0: { cellWidth: 50 } },
  });

  const servicesText = client.services?.trim();
  if (servicesText) {
    const finalY = (doc as any).lastAutoTable?.finalY || 120;
    doc.setFontSize(12);
    doc.text('Services', 14, finalY + 12);
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(servicesText, 14, finalY + 20, { maxWidth: 180 });
  }

  doc.save(`invoice_${client.name.replace(/\s+/g, '_').toLowerCase()}_${today.toISOString().split('T')[0]}.pdf`);
}
