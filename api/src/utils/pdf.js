const PDFDocument = require('pdfkit');

const generateInvoicePDF = (invoice) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        let pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Top Header / Seller details
      doc.fillColor('#7c3aed').fontSize(24).font('Helvetica-Bold').text('VYAPAAR X', 50, 50);
      doc.fillColor('#4b5563').fontSize(9).font('Helvetica').text('Wholesale & Supply Chain Solutions', 50, 80);
      doc.text('Mumbai, Maharashtra, India', 50, 95);

      // Invoice metadata
      doc.fillColor('#1f2937').fontSize(12).font('Helvetica-Bold').text('TAX INVOICE', 350, 50, { align: 'right' });
      doc.fontSize(10).font('Helvetica').text(`Invoice No: ${invoice.invoiceNumber}`, 350, 70, { align: 'right' });
      doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString('en-IN')}`, 350, 85, { align: 'right' });
      if (invoice.dueDate) {
        doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}`, 350, 100, { align: 'right' });
      }

      doc.moveDown(2);
      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, 125).lineTo(550, 125).stroke();

      // Bill To details
      doc.moveDown(1);
      doc.fillColor('#7c3aed').fontSize(10).font('Helvetica-Bold').text('BILLED TO (BUYER)', 50, 140);
      doc.fillColor('#1f2937').fontSize(11).font('Helvetica-Bold').text(invoice.customer?.name || 'Customer Name', 50, 155);
      doc.fillColor('#4b5563').fontSize(9).font('Helvetica');
      if (invoice.customer?.phone) doc.text(`Phone: ${invoice.customer.phone}`, 50, 170);
      if (invoice.customer?.email) doc.text(`Email: ${invoice.customer.email}`, 50, 185);
      if (invoice.customer?.gstin) doc.text(`GSTIN: ${invoice.customer.gstin}`, 50, 200);

      // Table Header
      let y = 240;
      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
      y += 10;
      doc.fillColor('#7c3aed').fontSize(9).font('Helvetica-Bold');
      doc.text('Item Description', 50, y);
      doc.text('Qty', 280, y, { width: 30, align: 'right' });
      doc.text('Price (INR)', 320, y, { width: 70, align: 'right' });
      doc.text('GST %', 400, y, { width: 50, align: 'right' });
      doc.text('Total (INR)', 470, y, { width: 80, align: 'right' });

      y += 15;
      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();

      // Table Rows
      doc.fillColor('#1f2937').fontSize(9).font('Helvetica');
      (invoice.items || []).forEach((item) => {
        y += 18;
        doc.text(item.product?.name || item.name || 'Product', 50, y, { width: 220 });
        doc.text(String(item.quantity), 280, y, { width: 30, align: 'right' });
        doc.text(item.price.toFixed(2), 320, y, { width: 70, align: 'right' });
        doc.text(`${item.gstRate}%`, 400, y, { width: 50, align: 'right' });
        doc.text(item.total.toFixed(2), 470, y, { width: 80, align: 'right' });
      });

      // Totals
      y += 30;
      doc.strokeColor('#e5e7eb').lineWidth(1).moveTo(300, y).lineTo(550, y).stroke();
      
      y += 10;
      doc.fontSize(9).font('Helvetica-Bold');
      doc.text('Subtotal:', 350, y, { width: 100, align: 'right' });
      doc.font('Helvetica').text(`INR ${invoice.subtotal.toFixed(2)}`, 460, y, { width: 90, align: 'right' });

      y += 15;
      doc.font('Helvetica-Bold').text('GST Amount:', 350, y, { width: 100, align: 'right' });
      doc.font('Helvetica').text(`INR ${invoice.gstAmount.toFixed(2)}`, 460, y, { width: 90, align: 'right' });

      y += 15;
      doc.fillColor('#7c3aed').font('Helvetica-Bold').fontSize(11);
      doc.text('Total Amount:', 350, y, { width: 100, align: 'right' });
      doc.text(`INR ${invoice.totalAmount.toFixed(2)}`, 460, y, { width: 90, align: 'right' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  generateInvoicePDF
};
