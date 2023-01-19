import { MikroORM } from '@mikro-orm/core';
import mikroOrmConfig from './mikro-orm.config';
import { Post } from './entities/Post';

const main = async () => {
	const orm = await MikroORM.init(mikroOrmConfig);
	await orm.getMigrator().up();
	// const post = orm.em.create(Post, {
	// 	title: 'my first post',
	// 	createdAt: '',
	// 	updatedAt: '',
	// });
	// await orm.em.persistAndFlush(post);

	// const posts = await orm.em.find(Post, {});
	// console.log(posts);
};

main().catch((err) => {
	console.log(err);
});
