import { ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { config } from 'src/shared/config/environments';
import { AppModule } from './app.module';
import { PaginateInterceptor } from './common/interceptors/pagination.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const { ENVIRONMENT, DATABASE_URL } = config;
    if (ENVIRONMENT === 'development') {
        console.log(`Ambiente: ${ENVIRONMENT}`);
        console.log(`Database URL: ${DATABASE_URL}`);
    }
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new PaginateInterceptor(app.get(Reflector)));

    const swaggerConfig = new DocumentBuilder()
        .setTitle('SAG')
        .setDescription('Sistema de Acompanhamento de Gestantes')
        .setVersion('1.0')
        .build();

    const documentFactory = () =>
        SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api', app, documentFactory);

    await app.listen(config.SERVER_PORT || 3000);
}
bootstrap();
