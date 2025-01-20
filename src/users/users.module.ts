import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { userProvides } from './users.provider';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/config/database/database.module';

@Module({
  controllers: [UsersController],
  providers: [...userProvides, UsersService],
  imports: [DatabaseModule],
})
export class UsersModule {}
