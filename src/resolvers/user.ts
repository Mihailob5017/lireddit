import { User } from '../entities/User';
import { MyContext } from 'src/types';
import {
	Resolver,
	Mutation,
	InputType,
	Field,
	Arg,
	Ctx,
	ObjectType,
} from 'type-graphql';
import argon2 from 'argon2';
// Alternative to using @Arg()
@InputType()
class UsernamePasswordInput {
	@Field()
	username: string;
	@Field()
	password: string;
}

@ObjectType()
class FieldError {
	@Field()
	field: string;
	@Field()
	messages: string;
}

@ObjectType()
class UserResponse {
	@Field(() => [FieldError], { nullable: true })
	errors?: FieldError[];

	@Field(() => User, { nullable: true })
	user?: User;
}

@Resolver()
export class UserResolver {
	@Mutation(() => UserResponse)
	async register(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { em }: MyContext
	): Promise<UserResponse> {
		if (options.username.length <= 2) {
			return {
				errors: [
					{ messages: 'Length must be greater than two', field: 'username' },
				],
			};
		}
		if (options.password.length <= 3) {
			return {
				errors: [
					{ messages: 'Length must be greater than two', field: 'password' },
				],
			};
		}
		const hashedPassowrd = await argon2.hash(options.password);
		const user = em.create(User, {
			username: options.username,
			password: hashedPassowrd,
			createdAt: '',
			updatedAt: '',
		});

		try {
			await em.persistAndFlush(user);
		} catch (error) {
			if (error.code === '23505' || error.detail.includes('already exists'))
				return {
					errors: [
						{
							field: 'username',
							messages: 'Username already taken',
						},
					],
				};
			return {
				errors: [
					{
						field: 'unknown',
						messages: error.detail,
					},
				],
			};
		}
		return { user: user };
	}

	@Mutation(() => UserResponse)
	async login(
		@Arg('options') options: UsernamePasswordInput,
		@Ctx() { em }: MyContext
	): Promise<UserResponse> {
		const user = await em.findOne(User, { username: options.username });
		if (!user) {
			return {
				errors: [
					{ field: 'username', messages: "that' username does't exist" },
				],
			};
		}
		const valid = await argon2.verify(user.password, options.password);
		if (!valid) {
			return { errors: [{ field: 'password', messages: 'Invalid password' }] };
		}
		return {
			user,
		};
	}
}
