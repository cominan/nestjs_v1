import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/utils/decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('get-token')
  @Public()
  signUp(@Body() body: Record<string, any>) {
    const refToken = body.refToken;
    return this.authService.getAccessToken(refToken);
  }
}
