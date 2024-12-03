import { Controller, Get } from '@nestjs/common';
import { KnuBatchService } from './batch.service';

@Controller()
export class KnuBatchController {
	constructor(private readonly knuBatchService: KnuBatchService) {}

	@Get()
	getHello(): string {
		return this.knuBatchService.getHello();
	}
}
