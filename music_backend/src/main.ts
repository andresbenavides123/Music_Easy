import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Sin restricciones para que no falle
  
  const port = process.env.PORT || 3000;
  // '0.0.0.0' ES LO QUE QUITA EL ERROR 502
  await app.listen(port, '0.0.0.0');
}
bootstrap();