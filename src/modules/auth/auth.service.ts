import { jwtConstants } from './constant';

import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))  private usersService: UsersService,
     private jwtService: JwtService
  ) {}


  async getAccessToken(refToken: string) {
    try {
      const user = await this.jwtService.verifyAsync(refToken, {
        secret: jwtConstants.refresh,
      });
      return this.login(user);
    } catch (error) {
      console.error('JWT Verification Failed:', error.message);
      throw new Error('Invalid or expired refresh token');
    }
  }
  

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.password };
    const refresh = this.jwtService.sign(payload, {
      expiresIn: '7d',
      secret: jwtConstants.refresh,
    })
    
   const userInfo = await this.usersService.findOne(user.username);
   userInfo.refreshToken = refresh;
   await userInfo.save();
    
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: '300s',
        secret: jwtConstants.secret,
      }),
      refresh_token: refresh,
    };
  }
}
