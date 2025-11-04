import { queryField, mutationField, nonNull, stringArg, list, arg, objectType, inputObjectType } from 'nexus';
import { RepcoCatalogService } from '../services/catalog-service';
import { RepcoOrderService } from '../services/order-service';
import { RepcoInvoiceService } from '../services/invoice-service';
import { RepcoStockService } from '../services/stock-service';

const RepcoPart = objectType({
  name: 'RepcoPart',
  definition(t) {
    t.string('sku');
    t.string('name');
    t.float('price');
    t.int('stock');
    t.string('location');
  },
});

export const searchRepcoParts = queryField('searchRepcoParts', {
  type: list(RepcoPart),
  args: { vin: stringArg(), part: stringArg() },
  resolve: async (_, args, ctx) => {
    const service = new RepcoCatalogService(ctx.tenantId);
    return service.search(args);
  },
});

const OrderItemInput = inputObjectType({
  name: 'OrderItemInput',
  definition(t) {
    t.nonNull.string('sku');
    t.nonNull.int('qty');
  },
});

export const createRepcoOrder = mutationField('createRepcoOrder', {
  type: 'String',
  args: {
    items: nonNull(list(arg({ type: 'OrderItemInput' }))),
    poNumber: stringArg(),
  },
  resolve: async (_, { items, poNumber }, ctx) => {
    const service = new RepcoOrderService();
    const result = await service.createOrder(ctx.tenantId, items, poNumber || `REP-${Date.now()}`);
    return result.orderId;
  },
});

export const getRepcoInvoicePdf = mutationField('getRepcoInvoicePdf', {
  type: 'String',
  args: { invoiceId: nonNull(stringArg()) },
  resolve: async (_, { invoiceId }, ctx) => {
    const service = new RepcoInvoiceService();
    return service.getInvoicePdf(invoiceId, ctx.tenantId);
  },
});
