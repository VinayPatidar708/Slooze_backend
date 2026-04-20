import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserModel } from './user.model';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../auth/roles.enum';
import { CurrentUser } from '../auth/current-user.decorator';

@Resolver(() => UserModel)
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => [UserModel])
  @Roles(Role.ADMIN)
  async allUsers() {
    return this.usersService.findAll();
  }

  @Query(() => UserModel)
  async me(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Query(() => [UserModel])
  @Roles(Role.ADMIN, Role.MANAGER)
  async usersInMyCountry(@CurrentUser() user: any) {
    return this.usersService.findByCountry(user.countryId);
  }
}
