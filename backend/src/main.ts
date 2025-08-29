import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000', // Frontend URL
      credentials: true,
    },
  });

  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3001);
  console.log('🚀 Backend rodando na porta 3001');
}

bootstrap();
