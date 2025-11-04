import axios from 'axios';
import { RepcoAuthService } from './auth-service';
import { prisma } from '../../../prisma/client';
import { REPCO_API } from '../config';

export class RepcoOrderService {
  async createOrder(tenantId: string, items: any[], poNumber: string) {
    const token = await RepcoAuthService.getToken(tenantId);
    const config = await prisma.repcoConfig.findUnique({ where: { organizationId: tenantId } });

    const res = await axios.post(`${REPCO_API.baseUrl}/v3/orders`, {
      poNumber,
      locationId: config?.locationId,
      items: items.map(i => ({ sku: i.sku, qty: i.qty })),
      delivery: { method: 'pickup' },
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  }
}
