import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { Types } from 'mongoose';
import { Public } from 'src/utils/decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(200)
  @Post()
  @Public()
  async create(@Body()createUserDto: CreateUserDto, @Headers() headers) {
    const newUser =await this.usersService.create(createUserDto);
    console.log(newUser);
    
    return {
      status: HttpStatus.OK,
      message: 'User created successfully',
      data: newUser,
    };
  }

  @Post('/verify')
  async verify(@Body() body: any) {
    const { userId, code } = body;
    const result = await this.usersService.verifyOtp(userId, code);
    return {
      status: HttpStatus.OK,
      data: result,
    };
  }
  @Get()
  findAll() {    
    return this.usersService.findAll();
  }

  @Put(':id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<string | NotFoundException> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
