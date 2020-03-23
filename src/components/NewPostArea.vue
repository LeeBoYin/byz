<template>
	<div id="new-post-area">
		<PostList :posts="newPosts" />
		<PostForm />
	</div>
</template>

<script>
import PostList from '@components/PostList';
import PostForm from '@components/PostForm';
export default {
	components: {
		PostForm,
		PostList,
	},
	computed: {
		...mapGetters('board', [
			'newPosts',
		]),
	},
};
</script>

<style lang="scss">
@import '~@style/custom';
#new-post-area {
	display: flex;
	flex-direction: column;
	padding: 10px;
	background-color: rgba(0, 0, 0, 0.05);
	.post-list {
		flex-grow: 1;
		flex-direction: column-reverse;
		.post {
			position: relative;
			animation: drop ease-in .3s;
			animation-iteration-count: 1;
			animation-fill-mode: backwards;
		}
	}
}

@keyframes drop {
	from {
		bottom: 100vh;
		opacity: 0;
	}
	to {
		bottom: 0;
		opacity: 1;
	}
}
</style>
