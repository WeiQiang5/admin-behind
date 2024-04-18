import { User } from 'src/modules/user/entities/user.entity';

export class LoginVo {
  access_token: string;
  userInfo: Omit<User, 'password'>;
}
