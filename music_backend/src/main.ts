import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CONFIGURACIÓN DE CORS COMPLETA
  app.enableCors({
    origin: 'https://music-easy-mu.vercel.app', // Tu URL de Vercel que sale en el error
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Si quieres que las rutas sean limpias, quita el setGlobalPrefix o úsalo bien
  // app.setGlobalPrefix('api'); 

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();