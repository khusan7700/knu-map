import { NestFactory } from '@nestjs/core';
import { KnuBatchModule } from './knu-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(KnuBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
