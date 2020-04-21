<template>
	<div class="post-area">
		<div class="post-area__header">
			New Posts
			<button class="post-area__btn-hide" @click="setIsShowPostArea(false)">
				<i class="las la-angle-down"></i>
			</button>
		</div>
		<PostList v-if="newPosts.length" :posts="newPosts" />
		<div v-else class="post-area__empty-placeholder frow centered">
			no post
		</div>
		<PostForm v-if="currentUser" />
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
			'currentUser',
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
