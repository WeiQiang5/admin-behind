import { IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UserinfoDto {
  @IsString()
  username: string;
  @IsString()
  @IsOptional()
  signName?: string;
  @IsString()
  @IsOptional()
  picImg?: string;
  @IsNumber()
  @IsOptional()
  age?: number;
  @IsPhoneNumber()
  @IsOptional()
  phone?: number;
}
