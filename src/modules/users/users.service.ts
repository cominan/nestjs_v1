import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import Redis from 'ioredis';
import { Model, Types } from 'mongoose';
import { hashPass } from 'src/utils/helper';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: 
  Model<UserDocument>, private readonly mailerService: MailerService,   @Inject('REDIS_CLIENT') private readonly redisClient: Redis, 
  @Inject(forwardRef(() => AuthService)) private authService: AuthService
) {}

  async generateOtp(userId: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Tạo OTP 6 số
    await this.redisClient.setex(`otp:${userId}`, 300, otp); // Lưu 5 phút
    return otp;
  }

  async verifyOtp(userId: string, otp: string): Promise<boolean> {
    const storedOtp = await this.redisClient.get(`otp:${userId}`);
    if (!storedOtp || storedOtp !== otp) {
      return false;
    }
    await this.redisClient.del(`otp:${userId}`);
    const user = await this.userModel.findOne({idOtp: userId});
    if(user) {
      user.isActive = true;
      await user.save();
    }
    return true;
  }

  async validateUser (username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({name: username});
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async create(createUserDto: CreateUserDto) {
    const passHash = await hashPass(createUserDto.password);
    const user = await this.userModel.findOne({email: createUserDto.email});
    if (user) {
      return new BadRequestException(`User with email ${createUserDto.email} already exists`);
    }
    const id = uuidv4();
    const otp =await this.generateOtp(id);

    console.log('otp', otp);
    
    this.mailerService
    .sendMail({
      to: createUserDto.email,
      subject: 'Code to active account',
      template: './comfirm',
      context: {
        name: createUserDto.email,
        code: otp,
      },
    })
    .then(() => {})
    .catch(() => {});
    createUserDto.password = passHash;
    createUserDto.idOtp = id;
    await this.userModel.create(createUserDto);
    return await this.authService.login(createUserDto);
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(name: string) {
    return await this.userModel.findOne({name: name});
  }

  async update(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    let user = await this.userModel.findByIdAndUpdate(
      id,
      {
        ...updateUserDto,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      return new NotFoundException(`User with ID ${id} not found`);
    }
    return user.name;
  }

  remove(id: string) {
    const user = this.userModel.findByIdAndDelete(id, {
      new: true,
    });
    console.log(user);
    
    if (!user) {
      return new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
