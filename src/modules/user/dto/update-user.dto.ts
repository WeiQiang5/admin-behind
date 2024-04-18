import { PartialType } from '@nestjs/swagger';
import { UserinfoDto } from './userInfo.dto';

export class UpdateUserDto extends PartialType(UserinfoDto) {}
