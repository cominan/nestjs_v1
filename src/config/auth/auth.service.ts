import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Auth } from 'src/auths/entities/auth.entity';
import { comparePassword, hashPassword } from 'src/config/helper/ultil';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private UsersService: UsersService,
    private jwtService: JwtService,
    private authService: AuthService,
    @Inject('AUTH_REPOSITORY')
    private authRepository: Repository<Auth>,
  ) {}

  async isEmailExist(email: string) {
    const emailExist = await this.authRepository.findOne({ where: { email } });
    if (emailExist) return true;
    return false;
  }
  async signIn(name: string, password: string) {
    const user = await this.UsersService.findOneUser(name);
    if (!user) throw new UnauthorizedException('User not found');
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid password');
    const payload = { sub: user.id, name: user.name };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(name: string, password: string, email: string) {
    const isEmailExist = await this.authService.isEmailExist(email);
    if (isEmailExist) {
      return {
        status: 400,
        message: 'Email already exists',
      };
    }
    const hashedPassword = await hashPassword(password);
    return this.UsersService.create({
      name,
      password: hashedPassword,
      email,
      type_login: 'EMAIL',
      roles: ['user'],
    });
  }
}
