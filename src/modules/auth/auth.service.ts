import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { compareCryption, encryption } from 'src/utils';
import { AUTHPROMPT } from 'src/enum/auth';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private authRepository: Repository<User>;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(UserService)
  private userService: UserService;

  async register(loginAuthDto: LoginAuthDto) {
    const exitUser = await this.authRepository.findOneBy({
      username: loginAuthDto.username,
    });
    console.log('exitUser', exitUser);

    if (exitUser) {
      throw new HttpException(AUTHPROMPT.USEREXIST, HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = loginAuthDto.username;
    // 加密用户密码
    const password = await encryption(loginAuthDto.password);
    newUser.password = password;
    console.log('newuser: ', newUser);

    try {
      await this.authRepository.save(newUser);
      return AUTHPROMPT.REGISTERSUCCESS;
    } catch (e) {
      throw new HttpException(
        AUTHPROMPT.REGISTERFAIL,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(loginAuthDto: LoginAuthDto) {
    const existUser = await this.authRepository.findOneBy({
      username: loginAuthDto.username,
    });
    const isPassword = await compareCryption(
      loginAuthDto.password,
      existUser.password,
    );
    if (!isPassword) {
      throw new HttpException(AUTHPROMPT.PASSWORDFAIL, HttpStatus.BAD_REQUEST);
    }
    const payload = { sub: existUser.id, username: existUser.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      userInfo: await this.userService.findOne(existUser.id),
    };
  }
}
