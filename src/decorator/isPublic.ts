import { SetMetadata } from '@nestjs/common';
// 不需要登录

export const IS_PUBLIC_KEY = 'isPublic';
export const isPublic = () => SetMetadata(IS_PUBLIC_KEY, true);
