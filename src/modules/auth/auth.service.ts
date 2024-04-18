import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { LoginAuthDto } from './dto/login-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { compareCryption, encryption } from 'src/utils';
import { AUTHPROMPT } from 'src/enum/auth';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginVo } from './vo/login.vo';
import { getConfig } from 'config/configuration';
const config = getConfig();
const jwtConfig = config['jwt'];
interface Payload {
  id: number;
  username: string;
}
export interface ReturnToken {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class AuthService {
  @InjectRepository(User)
  private authRepository: Repository<User>;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(UserService)
  private userService: UserService;

  createToken(payload: Payload): ReturnToken {
    const access_token = this.jwtService.sign(payload, {
      expiresIn: jwtConfig.accessExpiresIn,
    });
    const refresh_token = this.jwtService.sign(
      { id: payload.id },
      {
        expiresIn: jwtConfig.expireIn,
      },
    );
    return {
      access_token,
      refresh_token,
    };
  }
  async refreshToken(refreshToken: string): Promise<ReturnToken> {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findOneById(data.userId);
      const payload = { id: user.id, username: user.username };
      const { access_token, refresh_token } = this.createToken(payload);
      return {
        access_token,
        refresh_token,
      };
    } catch (e) {
      throw new HttpException('11', HttpStatus.UNAUTHORIZED);
    }
  }

  async register(loginAuthDto: LoginAuthDto): Promise<string> {
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

  async login(loginAuthDto: LoginAuthDto): Promise<LoginVo> {
    const existUser = await this.authRepository.findOneBy({
      username: loginAuthDto.username,
    });
    if (!existUser) {
      throw new HttpException(AUTHPROMPT.USERNOTEXIST, HttpStatus.BAD_REQUEST);
    }
    const isPassword = await compareCryption(
      loginAuthDto.password,
      existUser.password,
    );
    if (!isPassword) {
      throw new HttpException(AUTHPROMPT.PASSWORDFAIL, HttpStatus.BAD_REQUEST);
    }
    const payload = { id: existUser.id, username: existUser.username };
    const { access_token, refresh_token } = this.createToken(payload);
    return {
      userInfo: await this.userService.findOneById(existUser.id),
      access_token,
      refresh_token,
    };
  }
}
