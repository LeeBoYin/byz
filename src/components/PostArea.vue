<template>
	<div class="post-area">
		<div class="post-area__header mb-10 text-right">
			<button class="post-area__btn-hide" @click="updateIsShowPostArea(false)">
				<i class="las la-angle-down"></i>
			</button>
		</div>
		<PostList :posts="newPosts" />
		<PostForm class="mt-10" />
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
		...mapState('board', [
			'isShowPostArea',
		]),
		...mapGetters('board', [
			'newPosts',
		]),
	},
	methods: {
		...mapMutations('board', [
			'updateIsShowPostArea',
		]),
	},
};
</script>

<style lang="scss">
@import '~@style/custom';
.post-area {
	display: flex;
	flex-direction: column;
	padding: 10px;
	background-color: rgba(0, 0, 0, 0.05);
	&__header {
		flex-shrink: 0;
	}
	&__btn-hide {
		font-size: 20px;
		padding: 5px;
	}
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
	.post-form {
		flex-shrink: 0;
	}
}

@keyframes drop {
	0% {
		bottom: 100vh;
		opacity: 0;
	}
	70% {
		bottom: 0;
		opacity: 1;
	}
	85% {
		bottom: 20px;
	}
	100% {
		bottom: 0;
	}
}
</style>
