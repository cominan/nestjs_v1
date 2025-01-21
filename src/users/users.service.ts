import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { hashPassword } from './../config/helper/ultil';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USER_REPOSITORY')
    private usersRepository: Repository<User>,
  ) {}

  async isEmailExist(email: string) {
    const emailExist = await this.usersRepository.findOne({ where: { email } });
    if (emailExist) return true;
    return false;
  }

  async findOneUser(name: string) {
    return await this.usersRepository.findOne({ where: { name } });
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, name, password, type_login } = createUserDto;
      const isEmailExist = await this.isEmailExist(email);
      if (isEmailExist) {
        return {
          status: 400,
          message: 'Email already exists',
        };
      }
      const hashedPassword = await hashPassword(password);
      return this.usersRepository.save({
        email,
        name,
        password: hashedPassword,
        type_login,
      });
    } catch (error) {
      console.log(error);
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
