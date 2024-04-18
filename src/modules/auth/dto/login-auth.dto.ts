import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;
  @MinLength(6, { message: '密码最小长度为6' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
