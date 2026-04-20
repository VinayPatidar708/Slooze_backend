import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderModel } from './order.model';
import { AddItemInput } from './order.input';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => OrderModel)
@UseGuards(JwtAuthGuard)
export class OrdersResolver {
  constructor(private ordersService: OrdersService) {}

  @Query(() => [OrderModel])
  async myOrders(@CurrentUser() user: any) {
    return this.ordersService.myOrders(user.id);
  }

  @Query(() => OrderModel)
  async order(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.getOrder(id, user.id);
  }

  // All roles can create an order
  @Mutation(() => OrderModel)
  async createOrder(
    @Args('restaurantId', { type: () => Int }) restaurantId: number,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.createOrder(user.id, restaurantId, user.countryId);
  }

  // All roles can add items to their pending order
  @Mutation(() => OrderModel)
  async addItemToOrder(
    @Args('orderId', { type: () => Int }) orderId: number,
    @Args('input') input: AddItemInput,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.addItem(orderId, input, user.id);
  }

  // Admin + Manager only — enforced in service by checking role
  @Mutation(() => OrderModel)
  async checkoutOrder(
    @Args('orderId', { type: () => Int }) orderId: number,
    @Args('paymentMethodId', { type: () => Int }) paymentMethodId: number,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.checkout(orderId, paymentMethodId, user.id, user.role);
  }

  // Admin + Manager only — enforced in service by checking role
  @Mutation(() => OrderModel)
  async cancelOrder(
    @Args('orderId', { type: () => Int }) orderId: number,
    @CurrentUser() user: any,
  ) {
    return this.ordersService.cancelOrder(orderId, user.id, user.role);
  }
}
