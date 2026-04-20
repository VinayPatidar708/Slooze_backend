import { Module } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItemsResolver } from './menu-items.resolver';

@Module({
  providers: [MenuItemsService, MenuItemsResolver],
  exports: [MenuItemsService],
})
export class MenuItemsModule {}
