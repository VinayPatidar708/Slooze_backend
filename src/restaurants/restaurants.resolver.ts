import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { RestaurantModel } from './restaurant.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => RestaurantModel)
@UseGuards(JwtAuthGuard)
export class RestaurantsResolver {
  constructor(private restaurantsService: RestaurantsService) {}

  // all roles can see restaurants — but only in their country (Re-BAC)
  @Query(() => [RestaurantModel])
  async restaurants(@CurrentUser() user: any) {
    return this.restaurantsService.getAll(user.countryId);
  }

  @Query(() => RestaurantModel)
  async restaurant(
    @Args('id', { type: () => Int }) id: number,
    @CurrentUser() user: any,
  ) {
    return this.restaurantsService.getOne(id, user.countryId);
  }
}
