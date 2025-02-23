import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class OtpService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

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
    await this.redisClient.del(`otp:${userId}`); // Xóa OTP sau khi xác thực thành công
    return true;
  }
}
