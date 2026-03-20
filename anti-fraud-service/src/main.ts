import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { starConsumer } from './kafka/consumer';

async function bootstrap() {
  await starConsumer();

  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
}
bootstrap();
