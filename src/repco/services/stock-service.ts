import { WebSocket } from 'ws';
import { prisma } from '../../../prisma/client';
import { RepcoAuthService } from './auth-service';
import { REPCO_API } from '../config';

export class RepcoStockService {
  private ws: WebSocket | null = null;

  async connect(tenantId: string) {
    const token = await RepcoAuthService.getToken(tenantId);
    const config = await prisma.repcoConfig.findUnique({ where: { organizationId: tenantId } });

    this.ws = new WebSocket(`${REPCO_API.wsUrl}/stock?location=${config?.locationId}&token=${token}`);

    this.ws.on('message', async (data) => {
      const update = JSON.parse(data.toString());
      await prisma.repcoPart.updateMany({
        where: { organizationId: tenantId, sku: update.sku },
        data: { stock: update.available, price: update.price, lastSync: new Date() },
      });

      // PubSub
      // pubsub.publish('REPCO_STOCK_UPDATE', { tenantId, update });
    });

    this.ws.on('close', () => console.log('Repco WS closed'));
  }
}
