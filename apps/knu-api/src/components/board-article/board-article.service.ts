import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BoardArticle, BoardArticles } from '../../libs/dto/board-article/board-article';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { BoardArticleInput, BoardArticlesInquiry } from '../../libs/dto/board-article/board-article.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { BoardArticleStatus } from '../../libs/enums/board-article.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { BoardArticleUpdate } from '../../libs/dto/board-article/board-article.update';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';

import { Member } from '../../libs/dto/member/member';

@Injectable()
export class BoardArticleService {
	constructor(
		@InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticle>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		private readonly memberService: MemberService,
		private readonly viewService: ViewService,
	) {}

	//--------------------------------CREATE BOARD ARTICLE-----------------------------
	public async createBoardArticle(memberId: ObjectId, input: BoardArticleInput): Promise<BoardArticle> {
		input.memberId = memberId;
		try {
			const result = await this.boardArticleModel.create(input);
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberArticles', //validation
				modifier: 1,
			});

			return result;
		} catch (err) {
			console.log('Error, Service.model', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
	//--------------------------------GET BOARD ARTICLE--------------------------------
	public async getBoardArticle(memberId: ObjectId, articleId: ObjectId): Promise<BoardArticle> {
		const search: T = {
			_id: articleId,
			articleStatus: BoardArticleStatus.ACTIVE,
		};

		const targetBoardArticle: BoardArticle = await this.boardArticleModel.findOne(search).exec(); //agar xatolik yuzaga kelsa lean() qoshish kerak
		if (!targetBoardArticle) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		if (memberId) {
			const viewInput = { memberId: memberId, viewRefId: articleId, viewGroup: ViewGroup.ARTICLE };
			const newView = await this.viewService.recordView(viewInput);
			if (newView) {
				await this.boardArticleStatsEditor({ _id: articleId, targetKey: 'articleViews', modifier: 1 });
				targetBoardArticle.articleViews++;
			}

			//----------------------------------like-----------------------------------
			// const likeInput = { memberId: memberId, likeRefId: articleId, likeGroup: LikeGroup.ARTICLE };
			// targetBoardArticle.meLiked = await this.likeService.checkLikeExistence(likeInput);
		}

		targetBoardArticle.memberData = await this.memberService.getMember(null, targetBoardArticle.memberId);
		return targetBoardArticle;
	}
	//--------------------------------UPDATE BOARD ARTICLE-----------------------------
	public async updateBoardArticle(memberId: ObjectId, input: BoardArticleUpdate): Promise<BoardArticle> {
		const { _id, articleStatus } = input;

		const result = await this.boardArticleModel
			.findOneAndUpdate({ _id: _id, memberId: memberId, articleStatus: BoardArticleStatus.ACTIVE }, input, {
				new: true,
			})
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

		if (articleStatus === BoardArticleStatus.DELETE) {
			await this.memberService.memberStatsEditor({
				_id: memberId,
				targetKey: 'memberAricles',
				modifier: -1,
			});
		}
		return result;
	}
	//--------------------------------GET BOARD ARTICLES-------------------------------
	public async getBoardArticles(memberId: ObjectId, input: BoardArticlesInquiry): Promise<BoardArticles> {
		const { articleCategory, text } = input.search;
		const match: T = { articleStatus: BoardArticleStatus.ACTIVE };
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (articleCategory) match.articleCategory = articleCategory;
		if (text) match.articleTitle = { $regex: new RegExp(text, 'i') };
		if (input.search?.memberId) {
			match.memberId = shapeIntoMongoObjectId(input.search.memberId);
		}
		console.log('match:', match);

		const result = await this.boardArticleModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupAuthMemberLiked(memberId),
							lookupMember,
							{ $unwind: '$memberData' },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	//--------------------------------BOARDA RTICLE STATS EDITOR-----------------------
	public async boardArticleStatsEditor(input: StatisticModifier): Promise<BoardArticle> {
		const { _id, targetKey, modifier } = input;
		return await this.boardArticleModel
			.findByIdAndUpdate(
				_id,
				{ $inc: { [targetKey]: modifier } },
				{
					new: true,
				},
			)
			.exec();
	}
}