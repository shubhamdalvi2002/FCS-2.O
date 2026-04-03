import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CartItem } from '../types';

interface InvoiceData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  deliveryType: string;
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  date: string;
}

export const generateInvoicePDF = (data: InvoiceData) => {
  console.log('Generating Invoice PDF for Order:', data.orderId);
  
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(245, 166, 35); // Accent color
    doc.text('FCS 2.0 - Fresh Chicken & Eggs', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Near Agasti Kirana Shop, Akole, Maharashtra', 14, 28);
    doc.text('Phone: +91 98905 01565', 14, 33);

    // Invoice Title & Info
    doc.setFontSize(16);
    doc.setTextColor(0);
    doc.text('INVOICE', pageWidth - 14, 20, { align: 'right' });
    
    doc.setFontSize(10);
    doc.text(`Order ID: ${data.orderId}`, pageWidth - 14, 28, { align: 'right' });
    doc.text(`Date: ${data.date}`, pageWidth - 14, 33, { align: 'right' });

    // Customer Details
    doc.setDrawColor(230);
    doc.line(14, 40, pageWidth - 14, 40);
    
    doc.setFontSize(12);
    doc.text('Bill To:', 14, 50);
    doc.setFontSize(10);
    doc.text(`Name: ${data.customerName}`, 14, 57);
    doc.text(`Phone: ${data.customerPhone}`, 14, 62);
    if (data.customerEmail) doc.text(`Email: ${data.customerEmail}`, 14, 67);
    
    if (data.deliveryType === 'Delivery') {
      doc.text('Delivery Address:', 100, 50);
      const splitAddress = doc.splitTextToSize(data.address, 80);
      doc.text(splitAddress, 100, 57);
    } else {
      doc.text('Order Type: Shop Pickup', 100, 50);
    }

    // Table
    const tableData = data.items.map(item => [
      `${item.name}${item.cutType ? ` (${item.cutType})` : ''}`,
      `${item.quantity} ${item.unit}`,
      `₹${item.price}`,
      `₹${item.totalPrice}`
    ]);

    autoTable(doc, {
      startY: 75,
      head: [['Product', 'Qty', 'Price', 'Total']],
      body: tableData,
      headStyles: { fillColor: [245, 166, 35], textColor: [0, 0, 0] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      margin: { top: 75 },
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.text('Subtotal:', pageWidth - 60, finalY);
    doc.text(`₹${data.subtotal}`, pageWidth - 14, finalY, { align: 'right' });
    
    doc.text('Delivery Charge:', pageWidth - 60, finalY + 7);
    doc.text(`₹${data.deliveryCharge}`, pageWidth - 14, finalY + 7, { align: 'right' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total Amount:', pageWidth - 60, finalY + 17);
    doc.text(`₹${data.total}`, pageWidth - 14, finalY + 17, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150);
    doc.text('Thank you for shopping with FCS 2.0!', pageWidth / 2, finalY + 40, { align: 'center' });
    doc.text('This is a computer generated invoice.', pageWidth / 2, finalY + 45, { align: 'center' });

    // Save
    doc.save(`FCS_Invoice_${data.orderId}.pdf`);
    console.log('Invoice PDF generated and download triggered.');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
