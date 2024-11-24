import { Module } from '@nestjs/common';
import { KnuBatchController } from './knu-batch.controller';
import { KnuBatchService } from './knu-batch.service';

@Module({
  imports: [],
  controllers: [KnuBatchController],
  providers: [KnuBatchService],
})
export class KnuBatchModule {}
