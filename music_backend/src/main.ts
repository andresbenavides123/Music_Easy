import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Habilitar CORS para que Vercel pueda hablar con Railway
  app.enableCors({
    origin: '*', // Permite peticiones desde cualquier lugar (perfecto para el afán)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. Usar el prefijo /api (opcional, pero recomendado si tu frontend lo usa)
  app.setGlobalPrefix('api');

  // 3. ¡EL CAMBIO MÁS IMPORTANTE! 
  // Railway te da el puerto en una variable de entorno. Si no existe, usa el 3000.
  const port = process.env.PORT || 3000;
  
  await app.listen(port);
  console.log(`Servidor melo en el puerto ${port}`);
}
bootstrap();