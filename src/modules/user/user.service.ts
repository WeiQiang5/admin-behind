import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { USERPROMPT } from 'src/enum/user';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;
  findAll() {
    return `This action returns all user`;
  }

  async findOne(id: number) {
    const { password, ...userInfo } = await this.userRepository.findOneBy({
      id,
    });

    if (!userInfo) {
      throw new HttpException(USERPROMPT.NOTUSERINFO, HttpStatus.BAD_REQUEST);
    }
    return userInfo;
  }
}
