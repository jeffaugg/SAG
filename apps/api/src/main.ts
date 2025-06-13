import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { config } from 'src/shared/config/environments';
import { AppModule } from './app.module';
import { PaginateInterceptor } from './common/interceptors/pagination.interceptor';

async function bootstrap() {
  const { ENVIRONMENT, DATABASE_URL } = config;
  if (ENVIRONMENT === 'development') {
    console.log(`Ambiente: ${ENVIRONMENT}`);
    console.log(`Database URL: ${DATABASE_URL}`);
    console.log(config.MONGO_URI);
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new PaginateInterceptor(app.get(Reflector)));
  await app.listen(config.SERVER_PORT || 3000);
}
bootstrap();
