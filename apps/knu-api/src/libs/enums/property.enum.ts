import { registerEnumType } from '@nestjs/graphql';

export enum PropertyType {
	INTERNATIONALRESTAURANT = 'INTERNATIONALRESTAURANT',
	COFFEESHOP = 'COFFEESHOP',
	KOREANRESTAURANT = 'KOREANRESTAURANT',
	JUNKFOOD = 'JUNKFOOD',
	CONVERIENCESTORE = 'CONVERIENCESTORE',
	OTHERS = 'OTHERS',
}
registerEnumType(PropertyType, {
	name: 'PropertyType',
});

export enum PropertyStatus {
	ACTIVE = 'ACTIVE',
	SOLD = 'SOLD',
	DELETE = 'DELETE',
}
registerEnumType(PropertyStatus, {
	name: 'PropertyStatus',
});

export enum PropertyLocation {
	NORTHGATE = 'NORTHGATE',
	WESTGATE = 'WESTGATE',
	MAINGATE = 'MAINGATE',
}
registerEnumType(PropertyLocation, {
	name: 'PropertyLocation',
});
