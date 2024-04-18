import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { getConfig } from '../config/configuration';
import { logger } from './middleware/request.middleware';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { HttpFilter } from './filter/HttpFilter.exceptionFilter';

const config = getConfig();
const swaggerConfig = config['swagger'] ?? {
  enable: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix(config?.server.prefix ?? '/');
  // 增加全局验证管道
  app.useGlobalPipes(new ValidationPipe());
  // 响应拦截器
  app.useGlobalInterceptors(new TransformInterceptor());
  // 注册错误拦截器
  app.useGlobalFilters(new HttpFilter());
  // 中间件
  app.use(logger);

  // 集成日志
  // app.useLogger(new MyLogger({}));
  await app.listen(config.server.port);
}
bootstrap();
