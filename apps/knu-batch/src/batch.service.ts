import { Injectable } from '@nestjs/common';

@Injectable()
export class KnuBatchService {
  getHello(): string {
    return 'Welcome to KNU map Batch Server!';
  }
}
