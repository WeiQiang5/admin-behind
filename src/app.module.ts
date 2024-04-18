import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getConfig } from '../config/configuration';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './modules/user/user.module';
import * as chalk from 'chalk';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';

const config = getConfig();

const sqlConfig = config['db'] ?? {};
const jwtConfig = config['jwt'];
const logConfig = config['logger'] ?? {};
const redisConfig = config['redis'] ?? {};

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      isGlobal: true, //全局注入
      load: [getConfig],
    }),
    JwtModule.register({
      global: true,
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: jwtConfig.expireIn,
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: sqlConfig.host,
      port: sqlConfig.port,
      username: sqlConfig.username,
      password: sqlConfig.password,
      database: sqlConfig.database,
      // logging: true,
      timezone: sqlConfig.timezone,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: sqlConfig.synchronize,
      connectorPackage: 'mysql2',
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
