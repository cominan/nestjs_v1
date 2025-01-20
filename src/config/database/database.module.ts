
import { Module } from '@nestjs/common';
import { databaseProviders } from './datasource.providers';

@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
