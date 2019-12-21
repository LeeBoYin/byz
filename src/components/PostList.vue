<template>
	<div class="post-list">
		<h2>Posts</h2>
		<Post v-for="post in orderedPosts" :post="post" />
	</div>
</template>

<script>
import Post from './Post';
export default {
	components: {
		Post,
	},
	computed: {
		orderedPosts() {
			return _.reverse(_.sortBy(this.posts, (post) => {
				return _.get(post, ['timestamp', 'seconds'], moment().unix() + 60);
			}));
		},
		...mapState('board', [
			'posts',
		]),
	}
};
</script>

<style scoped>

</style>