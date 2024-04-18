import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import { isPublic } from 'src/decorator/isPublic';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Inject(UserService)
  @isPublic()
  @Post('register')
  register(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.register(loginAuthDto);
  }
  @isPublic()
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
  @Get('refresh')
  async refresh(@Query('refresh_token') refreshToken: string) {
    return await this.authService.refreshToken(refreshToken);
  }
}
