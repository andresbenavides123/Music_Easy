import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Abre el CORS de una vez
  app.enableCors();

  // 2. NO USES setGlobalPrefix('api') aquí si tu controlador ya tiene 'api'
  // Esto evitará el error del log que dice /api/api/

  // 3. Puerto dinámico para Railway
  const port = process.env.PORT || 3000;
  
  // Escuchar en 0.0.0.0 es obligatorio en Railway
  await app.listen(port, '0.0.0.0');
  console.log(`Servidor melo en el puerto ${port}`);
}
bootstrap();