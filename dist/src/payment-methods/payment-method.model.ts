import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class PaymentMethodModel {
  @Field(() => Int)
  id: number;

  @Field()
  type: string;

  @Field()
  last4: string;

  @Field()
  provider: string;

  @Field(() => Int)
  userId: number;

  @Field()
  createdAt: Date;
}
