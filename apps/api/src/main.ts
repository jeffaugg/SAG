import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { config } from 'src/shared/config/environments';
import { AppModule } from './app.module';

async function bootstrap() {
  const { ENVIRONMENT, DATABASE_URL } = config;
  if (ENVIRONMENT === 'development') {
    console.log(`Ambiente: ${ENVIRONMENT}`);
    console.log(`Database URL: ${DATABASE_URL}`);
  }

  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(config.SERVER_PORT || 3000);
}
bootstrap();
