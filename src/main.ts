import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { HttpExceptionFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes( new ValidationPipe({
    //whitelist: true serve para não mostrar dados que não foram definidos no auth.dto
    //exemplo: id!
    whitelist: true,
  }))
  //app.useGlobalFilters(new HttpExceptionFilter)
  await app.listen(3333);
}
bootstrap();
