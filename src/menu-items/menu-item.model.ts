import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class MenuItemModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => Float)
  price: number;

  @Field()
  category: string;

  @Field(() => Int)
  restaurantId: number;

  @Field()
  createdAt: Date;
}
