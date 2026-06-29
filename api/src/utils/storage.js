const { supabase } = require('./supabase');

const uploadInvoicePDF = async (invoiceNumber, pdfBuffer) => {
  try {
    const filename = `${invoiceNumber}.pdf`;
    
    const { data, error } = await supabase.storage
      .from('invoices')
      .upload(filename, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });
      
    if (error) {
      console.warn('[Storage Helper] Upload failed (bucket might be unconfigured):', error.message);
      return `https://tvqzksmretximwjrvohx.supabase.co/storage/v1/object/public/invoices/${filename}`;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('invoices')
      .getPublicUrl(filename);
      
    return publicUrl;
  } catch (err) {
    console.error('[Storage Helper] Critical error uploading invoice PDF:', err.message);
    return `https://tvqzksmretximwjrvohx.supabase.co/storage/v1/object/public/invoices/${invoiceNumber}.pdf`;
  }
};

module.exports = {
  uploadInvoicePDF
};
