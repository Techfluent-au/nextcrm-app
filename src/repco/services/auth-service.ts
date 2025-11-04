import axios from 'axios';
import { prisma } from '../../../prisma/client';
import { REPCO_API } from '../config';

export class RepcoAuthService {
  static async getToken(tenantId: string): Promise<string> {
    const config = await prisma.repcoConfig.findUnique({ where: { organizationId: tenantId } });
    if (!config?.enabled) throw new Error('Repco not configured');

    if (config.token && config.tokenExpiry && new Date(config.tokenExpiry) > new Date()) {
      return config.token;
    }

    const res = await axios.post(`${REPCO_API.baseUrl}${REPCO_API.authUrl}`, {
      grant_type: 'password',
      username: config.username,
      password: config.password,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    });

    const { access_token, expires_in } = res.data;

    await prisma.repcoConfig.update({
      where: { organizationId: tenantId },
      data: { token: access_token, tokenExpiry: new Date(Date.now() + expires_in * 1000) },
    });

    return access_token;
  }
}
