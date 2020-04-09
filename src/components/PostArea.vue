<template>
	<div class="post-area">
		<div class="post-area__header">
			New Posts
			<button class="post-area__btn-hide" @click="setIsShowPostArea(false)">
				<i class="las la-angle-down"></i>
			</button>
		</div>
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
		...mapState('board', [
			'isShowPostArea',
		]),
		...mapGetters('board', [
			'newPosts',
		]),
	},
	methods: {
		...mapActions('board', [
			'setIsShowPostArea',
		]),
	},
};
</script>

<style lang="scss">
@import '~@style/custom';
.post-area {
	display: flex;
	flex-direction: column;
	border-radius: $border-r-md;
	background-color: $c-background-dark;
	&__header {
		flex-shrink: 0;
		font-size: 16px;
		padding: 10px 24px;
		background-color: rgba(0, 0, 0, 0.03);
	}
	&__btn-hide {
		font-size: 18px;
		float: right;
	}
	.post-list {
		@include custom-scrollbar(#F7E0A4);
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
		padding: 10px;
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
