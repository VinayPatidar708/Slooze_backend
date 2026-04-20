import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthPayload {
  @Field()
  token: string;

  @Field()
  userId: number;

  @Field()
  role: string;

  @Field()
  countryId: number;
}
