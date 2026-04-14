async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Deja el CORS abierto para que no moleste
  
  // COMENTA O BORRA ESTA LÍNEA para evitar el doble /api
  // app.setGlobalPrefix('api'); 

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Servidor melo en el puerto ${port}`);
}
bootstrap();