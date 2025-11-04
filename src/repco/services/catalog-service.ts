import axios from 'axios';
import { RepcoAuthService } from './auth-service';
import { prisma } from '../../../prisma/client';
import { REPCO_API } from '../config';

export class RepcoCatalogService {
  private tenantId: string;
  private client: axios.AxiosInstance;

  constructor(tenantId: string) {
    this.tenantId = tenantId;
    this.client = axios.create({ baseURL: REPCO_API.baseUrl });
  }

  async search(query: { vin?: string; part?: string; make?: string; model?: string }) {
    const token = await RepcoAuthService.getToken(this.tenantId);
    const res = await this.client.get('/v3/parts/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: query,
    });

    const parts = res.data.parts;

    // Cache
    await prisma.repcoPart.createMany({
      data: parts.map((p: any) => ({
        tenantId: this.tenantId,
        sku: p.sku,
        name: p.name,
        brand: p.brand,
        price: p.tradePrice,
        stock: p.stock.available,
        location: p.location.id,
        vehicleFit: p.vehicleFit,
      })),
      skipDuplicates: true,
    });

    return parts;
  }
}
