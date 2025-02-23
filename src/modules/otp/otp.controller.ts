import { Body, Controller, Post } from '@nestjs/common';
import { OtpService } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  async sendOtp(@Body('userId') userId: string) {
    const otp = await this.otpService.generateOtp(userId);
    return { message: 'OTP generated', otp }; // Chỗ này nên gửi OTP qua SMS/Email thay vì trả về client
  }

  @Post('verify')
  async verifyOtp(@Body() body: { userId: string; otp: string }) {
    const isValid = await this.otpService.verifyOtp(body.userId, body.otp);
    return isValid ? { message: 'OTP valid' } : { message: 'OTP invalid' };
  }
}
