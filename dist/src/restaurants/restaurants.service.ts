import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RestaurantsService {
  constructor(private prisma: PrismaService) {}

  async getAll(countryId: number) {
    return this.prisma.restaurant.findMany({
      where: { countryId },
      orderBy: { name: 'asc' },
    });
  }

  async getOne(id: number, countryId: number) {
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { id, countryId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found or not in your country');
    }

    return restaurant;
  }

  async getCountryId(restaurantId: number): Promise<number> {
    const r = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { countryId: true },
    });
    if (!r) throw new NotFoundException('Restaurant not found');
    return r.countryId;
  }
}
