import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PropertyService } from './property.service';
import { MemberType } from '../../libs/enums/member.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Property } from '../../libs/dto/property/property';
import { PropertyInput } from '../../libs/dto/property/property.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { ObjectId } from 'mongoose';

@Resolver({})
export class PropertyResolver {
	constructor(private readonly propertyService: PropertyService) {}

	//----------------------------CREATE PROPERTY--------------------------

	@Roles(MemberType.TEACHER)
	@UseGuards(RolesGuard)
	@Mutation(() => Property)
	public async createProperty(
		@Args('input') input: PropertyInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Property> {
		console.log('Mutation: createProperty');
		input.memberId = memberId;
		return await this.propertyService.createProperty(input);
	}
}