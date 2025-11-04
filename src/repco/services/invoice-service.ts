import axios from 'axios';
import { RepcoAuthService } from './auth-service';
import { prisma } from '../../../prisma/client';
import { REPCO_API } from '../config';

export class RepcoInvoiceService {
  async getInvoicePdf(invoiceId: string, tenantId: string) {
    const token = await RepcoAuthService.getToken(tenantId);
    const res = await axios.get(`${REPCO_API.baseUrl}/v3/invoices/${invoiceId}/pdf`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'arraybuffer',
    });

    const pdfBuffer = Buffer.from(res.data);

    // Save to Invoice
    await prisma.invoices.updateMany({
      where: { organizationId: tenantId, invoice_number: invoiceId },
      data: { invoice_file_url: `data:application/pdf;base64,${pdfBuffer.toString('base64')}` },
    });

    return pdfBuffer.toString('base64');
  }
}
