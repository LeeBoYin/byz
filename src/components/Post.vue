<template>
	<div :class="{ 'post--deleting': isDeleting }" class="post" :data-post-id="post.id">
		<p class="post__content">{{ post.content }}</p>
		<div class="post__footer">
			<div class="frow direction-column grow-1 overflow-hidden">
				<div v-if="post.posterName" class="post__poster">by {{ post.posterName }}</div>
				<div class="post__timestamp">{{ postTime }}</div>
			</div>
			<button
				:class="{ 'post__btn-like--liked': isLikedByCurrentUser }"
				class="post__btn-like"
				@click="toggleLike">
				<i class="las la-thumbs-up"></i>
				<template v-if="likes">{{ likes }}</template>
			</button>
		</div>
		<i class="post__handle las la-grip-lines-vertical"></i>
		<div class="post__tools">
			<i class="post__tool-item las la-times" @click="onClickDelete"></i>
		</div>
	</div>
</template>

<script>
import setStringToClipBoard from 'set-string-to-clipboard';
export default {
	props: {
		post: Object,
	},
	data() {
		return {
			isDeleting: false,
			postTime: null,
		};
	},
	computed: {
		likes() {
			return _.get(this.post, 'likedUsers', []).length;
		},
		isLikedByCurrentUser() {
			return _.includes(this.post.likedUsers, _.get(this.currentUser, 'name'));
		},
		...mapGetters('board', [
			'currentUser',
		]),
	},
	created() {
		this.updatePostTime();
		setInterval(this.updatePostTime, 1000);
	},
	methods: {
		onClickCopy() {
			setStringToClipBoard(this.post.content);
		},
		onClickDelete() {
			this.$el.addEventListener('transitionend', () => {
				this.deletePost(this.post.id);
			});
			this.isDeleting = true;
			this.$nextTick(() => {
				this.$el.style.marginBottom = `-${ this.$el.offsetHeight }px`;
			});
		},
		toggleLike() {
			this.updatePost({
				postId: this.post.id,
				updateObj: {
					likedUsers: this.isLikedByCurrentUser
						? firebase.firestore.FieldValue.arrayRemove(this.currentUser.name)
						: firebase.firestore.FieldValue.arrayUnion(this.currentUser.name),
				},
			});
		},
		updatePostTime() {
			if(!this.post.timestamp) {
				this.postTime = 'posting...';
				return;
			}
			this.postTime = moment(this.post.timestamp.toDate()).fromNow();
		},
		...mapActions('board', [
			'deletePost',
			'updatePost',
		]),
	},
};
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.post {
	position: relative;
	background-color: #FFF;
	border-radius: $border-r-md;
	box-shadow: 3px 3px 0 rgba(0, 0, 0, .03),
				inset 4px 0 0 #eeeeee;
	display: flex;
	flex-direction: column;
	padding: 8px 0 8px 25px;
	word-break: break-all;
	transform-origin: top center;
	&:hover {
		box-shadow: 3px 3px 0 rgba(0, 0, 0, .03),
		inset 4px 0 0 #ffeec0;
	}
	&--deleting {
		opacity: 0.5;
		transition: .2s ease-out;
		transform: scale(0);
	}
	&__handle {
		@extend %tool;
		@extend %handle;
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 4px;
	}
	&__content {
		font-size: 16px;
		margin-top: 0;
		margin-right: 24px;
		flex-grow: 1;
	}
	&__footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		font-size: 0.7rem;
	}
	&__poster {
		@extend %text-ellipsis;
		color: #999;
		margin-bottom: 5px;
	}
	&__timestamp {
		@extend %text-ellipsis;
		color: #999;
	}
	&__tools {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1;
		display: flex;
		flex-direction: column;
	}
	&__tool-item {
		@extend %tool;
		padding: 5px;
	}
	&__btn-like {
		color: $c-gray;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding: 0 14px;
		i {
			font-size: 24px;
			margin-right: 2px;
		}
		&--liked {
			color: $c-secondary;
			i {
				animation: .2s thumb-up ease-in-out;
				animation-iteration-count: 1;
			}
		}
	}
}
@keyframes thumb-up {
	0% {
		transform: rotate(0deg);
	}
	50% {
		transform: rotate(-30deg);
	}
	100% {
		transform: rotate(0deg);
	}
}
</style>
