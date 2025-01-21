import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthsModule } from './auths/auths.module';
import { AuthModule } from './config/auth/auth.module';
import { AuthMiddleware } from './config/middleware/auth.middleware';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UsersModule, AuthModule, AuthsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware) // Đăng ký middleware
      .forRoutes('*'); // Áp dụng cho tất cả các route
  }
}
