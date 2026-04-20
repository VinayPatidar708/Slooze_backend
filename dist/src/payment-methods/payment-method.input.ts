import { InputType, Field } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';

@InputType()
export class AddPaymentMethodInput {
  @Field()
  @IsString()
  type: string;

  @Field()
  @IsString()
  @Length(4, 4)
  last4: string;

  @Field()
  @IsString()
  provider: string;
}

@InputType()
export class UpdatePaymentMethodInput {
  @Field({ nullable: true })
  @IsString()
  type?: string;

  @Field({ nullable: true })
  @IsString()
  provider?: string;
}
