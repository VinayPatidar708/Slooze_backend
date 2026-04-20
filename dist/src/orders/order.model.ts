import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class OrderItemModel {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Int)
  menuItemId: number;

  @Field()
  menuItemName: string;
}

@ObjectType()
export class OrderModel {
  @Field(() => Int)
  id: number;

  @Field()
  status: string;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  restaurantId: number;

  @Field(() => Int, { nullable: true })
  paymentMethodId: number;

  @Field(() => [OrderItemModel])
  items: OrderItemModel[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
