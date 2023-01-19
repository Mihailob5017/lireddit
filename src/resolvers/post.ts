import { Post } from '../entities/Post';
import { MyContext } from 'src/types';
import { Mutation, Resolver, Query, Int, Arg, Ctx } from 'type-graphql';

@Resolver()
export class PostResolver {
	@Query(() => [Post])
	posts(@Ctx() { em }: MyContext): Promise<Post[]> {
		return em.find(Post, {});
	}

	@Query(() => Post, { nullable: true })
	post(
		@Arg('id', () => Int) id: number,
		@Ctx() { em }: MyContext
	): Promise<Post | null> {
		return em.findOne(Post, { id });
	}

	@Mutation(() => Post)
	async createPost(
		@Arg('title', () => String) title: string,
		@Ctx() { em }: MyContext
	): Promise<Post | null> {
		const post = em.create(Post, {
			title,
			createdAt: '',
			updatedAt: '',
		});
		await em.persistAndFlush(post);
		return post;
	}

	@Mutation(() => Post)
	async updatePost(
		@Arg('id', () => Int) id: number,
		@Arg('title', () => String, { nullable: true }) title: string,
		@Ctx() { em }: MyContext
	): Promise<Post | null> {
		const post = await em.findOne(Post, { id });
		if (!post) {
			return null;
		}
		if (typeof title !== 'undefined') {
			post.title = title;
			await em.persistAndFlush(post);
		}

		return post;
	}

	@Mutation(() => Boolean)
	async deletePost(
		@Arg('id', () => Int) id: number,
		@Ctx() { em }: MyContext
	): Promise<Boolean | null> {
		const post = await em.findOne(Post, { id });
		if (!post) {
			return null;
		}
		await em.removeAndFlush(post);

		// OPTION 2 -> Ben's option
		// try {
		//     await em.nativeDelete(Post,{id})
		// } catch (error) {
		//     return false;
		// }

		return true;
	}
}
