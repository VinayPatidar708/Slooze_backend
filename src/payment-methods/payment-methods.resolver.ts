import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PaymentMethodsService } from './payment-methods.service';
import { PaymentMethodModel } from './payment-method.model';
import { AddPaymentMethodInput, UpdatePaymentMethodInput } from './payment-method.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => PaymentMethodModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentMethodsResolver {
  constructor(private paymentMethodsService: PaymentMethodsService) {}

  // Admin only — members and managers cannot manage payment methods
  @Query(() => [PaymentMethodModel])
  @Roles(Role.ADMIN)
  async myPaymentMethods(@CurrentUser() user: any) {
    return this.paymentMethodsService.getMyPaymentMethods(user.id);
  }

  @Mutation(() => PaymentMethodModel)
  @Roles(Role.ADMIN)
  async addPaymentMethod(
    @Args('input') input: AddPaymentMethodInput,
    @CurrentUser() user: any,
  ) {
    return this.paymentMethodsService.addPaymentMethod(user.id, input);
  }

  @Mutation(() => PaymentMethodModel)
  @Roles(Role.ADMIN)
  async updatePaymentMethod(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdatePaymentMethodInput,
    @CurrentUser() user: any,
  ) {
    return this.paymentMethodsService.updatePaymentMethod(id, user.id, input);
  }

  @Mutation(() => Boolean)
  @Roles(Role.ADMIN)
  async removePaymentMethod(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: any,
  ) {
    return this.paymentMethodsService.removePaymentMethod(id, user.id);
  }
}
