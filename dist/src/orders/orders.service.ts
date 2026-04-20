import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddItemInput } from './order.input';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  private async buildOrderResult(orderId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { menuItem: true } },
      },
    });

    return {
      ...order,
      items: order.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        menuItemId: i.menuItemId,
        menuItemName: i.menuItem.name,
      })),
    };
  }

  async createOrder(userId: number, restaurantId: number, userCountryId: number) {
    // Re-BAC: make sure the restaurant is in user's country
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { id: restaurantId, countryId: userCountryId },
    });

    if (!restaurant) {
      throw new ForbiddenException('Restaurant not in your country');
    }

    const order = await this.prisma.order.create({
      data: { userId, restaurantId, status: 'PENDING', totalAmount: 0 },
      include: { items: true },
    });

    return { ...order, items: [] };
  }

  async addItem(orderId: number, input: AddItemInput, userId: number) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');
    if (order.status !== 'PENDING') {
      throw new BadRequestException('Can only add items to a pending order');
    }

    const menuItem = await this.prisma.menuItem.findFirst({
      where: { id: input.menuItemId, restaurantId: order.restaurantId },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found in this restaurant');
    }

    const lineTotal = menuItem.price * input.quantity;

    await this.prisma.orderItem.create({
      data: {
        orderId,
        menuItemId: input.menuItemId,
        quantity: input.quantity,
        unitPrice: menuItem.price,
      },
    });

    await this.prisma.order.update({
      where: { id: orderId },
      data: { totalAmount: { increment: lineTotal } },
    });

    return this.buildOrderResult(orderId);
  }

  async checkout(orderId: number, paymentMethodId: number, userId: number, userRole: string) {
    if (userRole === 'MEMBER') {
      throw new ForbiddenException('Members cannot checkout orders');
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');
    if (order.status !== 'PENDING') {
      throw new BadRequestException('Only pending orders can be checked out');
    }

    const pm = await this.prisma.paymentMethod.findFirst({
      where: { id: paymentMethodId, userId },
    });

    if (!pm) throw new NotFoundException('Payment method not found');

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED', paymentMethodId },
      include: { items: { include: { menuItem: true } } },
    });

    return {
      ...updated,
      items: updated.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        menuItemId: i.menuItemId,
        menuItemName: i.menuItem.name,
      })),
    };
  }

  async cancelOrder(orderId: number, userId: number, userRole: string) {
    if (userRole === 'MEMBER') {
      throw new ForbiddenException('Members cannot cancel orders');
    }

    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');

    if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
      throw new BadRequestException('Order cannot be cancelled at this stage');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
      include: { items: { include: { menuItem: true } } },
    });

    return {
      ...updated,
      items: updated.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        menuItemId: i.menuItemId,
        menuItemName: i.menuItem.name,
      })),
    };
  }

  async myOrders(userId: number) {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: { include: { menuItem: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => ({
      ...order,
      items: order.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        menuItemId: i.menuItemId,
        menuItemName: i.menuItem.name,
      })),
    }));
  }

  async getOrder(orderId: number, userId: number) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { menuItem: true } } },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');

    return {
      ...order,
      items: order.items.map((i) => ({
        id: i.id,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        menuItemId: i.menuItemId,
        menuItemName: i.menuItem.name,
      })),
    };
  }
}
