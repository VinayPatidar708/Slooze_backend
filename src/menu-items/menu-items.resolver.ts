import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItemModel } from './menu-item.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => MenuItemModel)
@UseGuards(JwtAuthGuard)
export class MenuItemsResolver {
  constructor(private menuItemsService: MenuItemsService) {}

  @Query(() => [MenuItemModel])
  async menuItems(
    @Args('restaurantId', { type: () => Int }) restaurantId: number,
    @CurrentUser() user: any,
  ) {
    return this.menuItemsService.getByRestaurant(restaurantId, user.countryId);
  }

  @Query(() => MenuItemModel)
  async menuItem(@Args('id', { type: () => Int }) id: number) {
    return this.menuItemsService.getOne(id);
  }
}
