import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MemberAuthType, MemberStatus, MemberType } from '../../enums/member.enum';
import { ViewGroup } from '../../enums/view.enum';

@ObjectType()
export class View {
	@Field(() => String)
	_id: Object;

	@Field(() => ViewGroup)
	viewGroup: ViewGroup;

	@Field(() => String)
	viewRefId: Object;

	@Field(() => String)
	memberId: Object;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;
}
