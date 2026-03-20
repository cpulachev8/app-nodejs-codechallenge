import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { connectProducer } from './kafka/producer';
import { startConsumer } from './kafka/consumer';

async function bootstrap() {
  await connectProducer();
  await startConsumer();

  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
