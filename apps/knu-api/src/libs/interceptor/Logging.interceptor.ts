import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	private readonly logger: Logger = new Logger();

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const recordTime = Date.now();
		const type = context.getType();
		this.logger.log(`Type ${type}`, 'REQUEST');

		if (type === 'http') {
			console.log('HTTP ------> request');
		} else {
			/** (1) Print Request */
			console.log('GraphQL------> request');

			const gqlContext = GqlExecutionContext.create(context);

			this.logger.log(` ${this.stringify(gqlContext.getContext().req.body)}`, 'REQUEST');

			/** (2) Errors handing cia GraphQL */

			/** (3) No Errors, giving Response below */
			return next.handle().pipe(
				tap((context) => {
					const responseTime = Date.now() - recordTime;
					/** (1) Print Request */
					this.logger.log(`${this.stringify(context)} - ${responseTime}ms \n\n`, 'RESPONSE');
				}),
			);
		}
		return next.handle().pipe(
			tap(() => {
				const responseTime = Date.now() - recordTime;
				this.logger.log(`${responseTime}ms`, 'RESPONSE');
			}),
		);
	}
	private stringify(context: ExecutionContext): string {
		return JSON.stringify(context).slice(0, 100);
	}
}
/*
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		console.log('Before...');

		const now = Date.now();
		return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
	}
}

*/
