import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from 'src/config/database/database.module';
import { RolesGuard } from 'src/config/role/roles.guard';
import { UsersController } from './users.controller';
import { userProvides } from './users.provider';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [
    ...userProvides,
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  imports: [DatabaseModule],
  exports: [UsersService],
})
export class UsersModule {}
