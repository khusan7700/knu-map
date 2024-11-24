import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PROPERTY = 'PROPERTY',
	ARTICLE = 'ARTICLE',
	BoardArticle = 'BoardArticle',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
