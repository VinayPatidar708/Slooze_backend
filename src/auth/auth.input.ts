import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength, IsIn, IsInt } from 'class-validator';

@InputType()
export class RegisterInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(6)
  password: string;

  @Field()
  @IsIn(['ADMIN', 'MANAGER', 'MEMBER'])
  role: string;

  @Field()
  @IsInt()
  countryId: number;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  password: string;
}
