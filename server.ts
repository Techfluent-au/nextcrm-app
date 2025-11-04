import { WebSocketServer } from 'ws';
import { RepcoStockService } from './src/repco/services/stock-service';

const wss = new WebSocketServer({ port: 8082 });

wss.on('connection', async (ws, req) => {
  const tenantId = req.headers['x-tenant-id'] as string;
  const stockService = new RepcoStockService();
  await stockService.connect(tenantId);

  // Forward updates
  // pubsub.asyncIterator('REPCO_STOCK_UPDATE').subscribe(update => ws.send(JSON.stringify(update)));
});
