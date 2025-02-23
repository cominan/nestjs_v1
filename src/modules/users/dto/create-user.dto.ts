import { Prop } from '@nestjs/mongoose';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsString()
  email: string;


  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  image: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  role?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  accountType?: string;

  @IsOptional()
  @IsBoolean()
  @Prop({default: false})
  isActive: boolean;

  @IsOptional()
  @IsString()
  @IsOptional()
  codeId?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  codeExpired?: Date;

  @IsOptional()
  @IsString()
  @IsOptional()
  refreshToken?: string;

  @IsOptional()
  @IsString()
  idOtp?: string;
}
