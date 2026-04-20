import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, Min } from 'class-validator';

@InputType()
export class AddItemInput {
  @Field(() => Int)
  @IsInt()
  menuItemId: number;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;
}
