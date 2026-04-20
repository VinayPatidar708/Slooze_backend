import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MenuItemsService {
  constructor(private prisma: PrismaService) {}

  async getByRestaurant(restaurantId: number, userCountryId: number) {
    // verify the restaurant belongs to this user's country
    const restaurant = await this.prisma.restaurant.findFirst({
      where: { id: restaurantId, countryId: userCountryId },
    });

    if (!restaurant) {
      throw new ForbiddenException('Restaurant not in your country');
    }

    return this.prisma.menuItem.findMany({
      where: { restaurantId },
      orderBy: { category: 'asc' },
    });
  }

  async getOne(id: number) {
    const item = await this.prisma.menuItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Menu item not found');
    return item;
  }
}
