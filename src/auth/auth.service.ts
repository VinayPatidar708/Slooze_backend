import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterInput, LoginInput } from './auth.input';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(input: RegisterInput) {
    const existing = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) throw new ConflictException('Email already in use');

    const hashed = await bcrypt.hash(input.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: hashed,
        role: input.role as any,
        countryId: input.countryId,
      },
    });

    const token = this.signToken(user.id, user.email, user.role, user.countryId);

    return { token, userId: user.id, role: user.role, countryId: user.countryId };
  }

  async login(input: LoginInput) {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordOk = await bcrypt.compare(input.password, user.password);
    if (!passwordOk) throw new UnauthorizedException('Invalid credentials');

    const token = this.signToken(user.id, user.email, user.role, user.countryId);

    return { token, userId: user.id, role: user.role, countryId: user.countryId };
  }

  private signToken(userId: number, email: string, role: string, countryId: number) {
    return this.jwt.sign({
      sub: userId,
      email,
      role,
      countryId,
    });
  }
}
