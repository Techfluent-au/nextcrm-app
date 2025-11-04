export const REPCO_API = {
  baseUrl: 'https://api.ezyparts.repco.com.au',
  authUrl: '/auth/token',
  wsUrl: 'wss://api.ezyparts.repco.com.au/ws',
  sandbox: {
    baseUrl: 'https://sandbox.ezyparts.repco.com.au',
  },
} as const;
