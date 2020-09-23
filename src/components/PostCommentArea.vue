<template>
	<div
		:class="{
			'post-comment-area--open': isOpen,
		}"
		class="post-comment-area"
	>
		<div v-if="isShowInner" class="post-comment-area__inner">
			<div class="post-comment-area__title">
				{{ title }}
			</div>
			<TransitionGroup
				v-if="comments"
				class="post-comment-area__comment-list"
				name="comment-list"
			>
				<PostComment
					v-for="comment in comments"
					:key="comment.id"
					:comment="comment"
				/>
			</TransitionGroup>
			<PostCommentForm
				v-if="!isGuestMode"
				:post-id="postId"
				class="post-comment-area__form"
			/>
		</div>
	</div>
</template>

<script>
import { transitionendOnce } from '@libs/uiUtils';
import PostComment from '@components/PostComment';
import PostCommentForm from '@components/PostCommentForm';
export default {
	components: {
		PostComment,
		PostCommentForm,
	},
	props: {
		postId: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			isFetchingComments: false,
			isOpen: false,
			isShowInner: false,
		};
	},
	computed: {
		comments() {
			return this.getCommentsByPostId(this.postId);
		},
		post() {
			return this.getPostById(this.postId);
		},
		title() {
			const commentCount = this.post.commentCount || this.comments.length;
			if(!commentCount) {
				return 'No comment';
			}
			return `${ commentCount } comment${ commentCount > 1 ? 's' : '' }`;
		},
		...mapState('board', [
			'isGuestMode',
		]),
		...mapGetters('board', [
			'getCommentsByPostId',
			'getPostById',
		]),
	},
	methods: {
		async expand() {
			this.fetchComments();
			this.isShowInner = true;
			await this.$nextTick(); // wait inner rendered
			return new Promise((resolve) => {
				this.$el.classList.add('post-comment-area--open');
				const expandedHeight = this.$el.offsetHeight;
				this.$el.classList.remove('post-comment-area--open');

				// play
				requestAnimationFrame(() => {
					this.$el.style.height = expandedHeight;
					this.$el.style.overflow = 'hidden';
					this.isOpen = true;
				});
				// end
				transitionendOnce(this.$el, () => {
					this.$el.style.height = '';
					this.$el.style.overflow = '';
				});
			});
		},
		collapse() {
			this.stopFetchComments();
			return new Promise((resolve) => {
				const expandedHeight = this.$el.offsetHeight;
				this.$el.style.height = expandedHeight;

				// play
				requestAnimationFrame(() => {
					this.$el.style.height = '';
					this.$el.style.overflow = 'hidden';
					this.isOpen = false;
				});
				// end
				transitionendOnce(this.$el, () => {
					this.$el.style.overflow = '';
					this.isShowInner = false;
					resolve();
				});
			});
		},
		async fetchComments() {
			this.isFetchingComments = true;
			await this.fetchCommentsByPostId(this.postId);
			this.isFetchingComments = false;
		},
		stopFetchComments() {
			this.stopFetchCommentsByPostId(this.postId);
		},
		...mapActions('board', [
			'fetchCommentsByPostId',
			'stopFetchCommentsByPostId',
		]),
	},
};
</script>
