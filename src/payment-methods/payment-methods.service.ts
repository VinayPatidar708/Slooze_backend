import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddPaymentMethodInput, UpdatePaymentMethodInput } from './payment-method.input';

@Injectable()
export class PaymentMethodsService {
  constructor(private prisma: PrismaService) {}

  async getMyPaymentMethods(userId: number) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addPaymentMethod(userId: number, input: AddPaymentMethodInput) {
    return this.prisma.paymentMethod.create({
      data: {
        userId,
        type: input.type,
        last4: input.last4,
        provider: input.provider,
      },
    });
  }

  async updatePaymentMethod(id: number, userId: number, input: UpdatePaymentMethodInput) {
    const pm = await this.prisma.paymentMethod.findUnique({ where: { id } });

    if (!pm) throw new NotFoundException('Payment method not found');
    if (pm.userId !== userId) throw new ForbiddenException('Not your payment method');

    return this.prisma.paymentMethod.update({
      where: { id },
      data: {
        ...(input.type && { type: input.type }),
        ...(input.provider && { provider: input.provider }),
      },
    });
  }

  async removePaymentMethod(id: number, userId: number) {
    const pm = await this.prisma.paymentMethod.findUnique({ where: { id } });

    if (!pm) throw new NotFoundException('Payment method not found');
    if (pm.userId !== userId) throw new ForbiddenException('Not your payment method');

    await this.prisma.paymentMethod.delete({ where: { id } });
    return true;
  }
}
