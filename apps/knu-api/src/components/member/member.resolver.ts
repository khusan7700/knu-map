import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { AgentsInquiry, LoginInput, MemberInput, MembersInquiry } from '../../libs/dto/member/member.input';
import { Member, Members } from '../../libs/dto/member/member';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';

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

	//-------------------------GET MEMBER---------------------------
	@UseGuards(WithoutGuard)
	@Query(() => Member)
	public async getMember(@Args('memberId') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Member> {
		console.log('Query: getMember');
		const targetId = shapeIntoMongoObjectId(input);
		return await this.memberService.getMember(memberId, targetId);
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

	//-------------------------getAgents---------------------------
	@UseGuards(WithoutGuard)
	@Query(() => Members)
	public async getAgents(@Args('input') input: AgentsInquiry, @AuthMember('_id') memberId: ObjectId): Promise<Members> {
		console.log('Query: getAgents');
		return await this.memberService.getAgents(memberId, input);
	}
	/**  								ADMIN 									**/

	//-------------------------get All Members By Admin---------------------------

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Members)
	public async getAllMembersByAdmin(@Args('input') input: MembersInquiry): Promise<Members> {
		console.log('Query: getAgents');
		return await this.memberService.getAllMembersByAdmin(input);
	}
	//--------------------------update Member By Admin--------------------------

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Member)
	public async updateMemberByAdmin(@Args('input') input: MemberUpdate): Promise<Member> {
		console.log('Mutation: updateMemberByAdmin');
		return await this.memberService.updateMemberByAdmin(input);
	}

	//--------------------------image Uploader-------------------------

	//--------------------------images Uploader-------------------------
}
