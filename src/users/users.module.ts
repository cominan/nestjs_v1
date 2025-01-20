import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { UsersController } from './users.controller';
import { userProvides } from './users.provider';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [...userProvides, UsersService],
  imports: [DatabaseModule],
})
export class UsersModule {}
