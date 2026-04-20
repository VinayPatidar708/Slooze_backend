import { ObjectType, Field, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class RestaurantModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  address: string;

  @Field(() => Int)
  countryId: number;

  @Field()
  createdAt: Date;
}
