import { Test, TestingModule } from '@nestjs/testing';
import { KnuBatchController } from './knu-batch.controller';
import { KnuBatchService } from './knu-batch.service';

describe('KnuBatchController', () => {
  let knuBatchController: KnuBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [KnuBatchController],
      providers: [KnuBatchService],
    }).compile();

    knuBatchController = app.get<KnuBatchController>(KnuBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(knuBatchController.getHello()).toBe('Hello World!');
    });
  });
});
