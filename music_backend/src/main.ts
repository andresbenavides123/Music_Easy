import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // <--- FUNDAMENTAL para que React conecte
  await app.listen(3000);
  console.log('Servidor melo en el puerto 3000');
}
bootstrap();