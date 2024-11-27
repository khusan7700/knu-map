import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Member } from '../../libs/dto/member/member';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';

@Resolver()
export class MemberResolver {
	constructor(private readonly memberService: MemberService) {}

	//-------------------------SIGNUP---------------------------
	@Mutation(() => Member)
	public async signup(@Args('input') input: MemberInput): Promise<Member> {
		console.log('Mutation: signup');
		console.log('input', input);
		return await this.memberService.signup(input);
	}

	//-------------------------LOGIN---------------------------
	@Mutation(() => Member)
	public async login(@Args('input') input: LoginInput): Promise<Member> {
		console.log('Mutation: login');
		return await this.memberService.login(input);
	}

	//-------------------------UPDATE---------------------------
	@UseGuards(AuthGuard)
	@Mutation(() => Member)
	public async updateMember(
		@Args('input') input: MemberUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Member> {
		console.log('Mutation: updateMember');
		delete input._id;
		return this.memberService.updateMember(memberId, input);
	}

	//-------------------------CHECKAUTH---------------------------
	@UseGuards(AuthGuard)
	@Mutation(() => String)
	public async checkAuth(@AuthMember('memberNick') memberNick: string): Promise<string> {
		console.log('Mutation: checkAuth');
		return `Hi ${memberNick}`;
	}
	//-------------------------checkAuthRoles---------------------------
	@Roles(MemberType.STUDENT, MemberType.TEACHER)
	@UseGuards(RolesGuard)
	@Mutation(() => String)
	public async checkAuthRoles(@AuthMember() AuthMember: Member): Promise<string> {
		console.log('Query: : checkAuthRoles');
		return `Hi ${AuthMember.memberNick},you are ${AuthMember.memberType} (memberId: ${AuthMember._id})`;
	}

	//-------------------------GET MEMBER---------------------------
	@Query(() => String)
	public async getMember(): Promise<string> {
		console.log('Query: getMember');
		return this.memberService.getMember();
	}

	/**  								ADMIN 									**/

	//-------------------------get All Members By Admin---------------------------

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => String)
	public async getAllMembersByAdmin(@AuthMember() authMember: Member): Promise<string> {
		console.log('Mutation: getAllMembersByAdmin');
		return this.memberService.getAllMembersByAdmin();
	}

	//--------------------------update Member By Admin--------------------------
	@Query(() => String)
	public async updateMemberByAdmin(): Promise<string> {
		console.log('Query: updateMemberByAdmin');
		return this.memberService.updateMemberByAdmin();
	}

	//--------------------------image Uploader-------------------------

	//--------------------------images Uploader-------------------------
}
