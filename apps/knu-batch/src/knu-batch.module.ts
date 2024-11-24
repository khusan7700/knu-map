import { Module } from '@nestjs/common';
import { KnuBatchController } from './knu-batch.controller';
import { KnuBatchService } from './knu-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [KnuBatchController],
  providers: [KnuBatchService],
})
export class KnuBatchModule {}
