<template>
	<div :class="{ 'post--deleting': isDeleting }" class="post" :data-post-id="post.id">
		<p class="post__content">{{ post.content }}</p>
		<div class="frow justify-end">
			<button
				:class="{ 'post__btn-like--liked': isLikedByCurrentUser }"
				class="post__btn-like"
				@click="toggleLike">
				<i class="las la-thumbs-up"></i>
				<template v-if="likes">{{ likes }}</template>
			</button>
		</div>
		<div class="post__footer">
			<div v-if="post.posterName" class="post__poster">by {{ post.posterName }}</div>
			<div class="post__timestamp">{{ postTime }}</div>
		</div>
		<i class="post__handle las la-grip-lines-vertical"></i>
		<i v-if="!isDeleting" class="post__btn-delete las la-times" @click="onClickDelete"></i>
	</div>
</template>

<script>
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
			return _.includes(this.post.likedUsers, this.currentUser.name);
		},
		...mapGetters('board', [
			'currentUser',
		]),
	},
	created() {
		setInterval(() => {
			if(!this.post.timestamp) {
				this.postTime = 'posting...';
				return;
			}
			this.postTime = moment(this.post.timestamp.toDate()).fromNow();
		}, 1000);
	},
	methods: {
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
	border-radius: 10px;
	box-shadow: 3px 3px 0 rgba(0, 0, 0, .03),
				inset 4px 0 0 #eeeeee;
	display: flex;
	flex-direction: column;
	padding: 15px 25px;
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
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 4px;
		color: #CCCCCC;
		cursor: grab;
		&:hover {
			color: #999999;
		}
		&:active {
			cursor: grabbing;
		}
	}
	&__content {
		color: #333;
		font-size: 16px;
		margin-top: 0;
		flex-grow: 1;
	}
	&__footer {
		display: flex;
		font-size: 0.7rem;
	}
	&__poster {
		@extend %text-ellipsis;
		flex-grow: 1;
		color: #999;
	}
	&__timestamp {
		color: #999;
		white-space: nowrap;
	}
	&__btn-delete {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1;
		padding: 5px;
		cursor: pointer;
		color: #CCCCCC;
		&:hover {
			color: #999999;
		}
	}
	&__btn-like {
		font-size: 1rem;
		background-color: #FFFFFF;
		border: 1px solid #CCCCCC;
		border-radius: 30px;
		padding: 3px 10px;
		&--liked {
			color: #039be5;
			i {
				animation: .3s thumb-up ease-in-out;
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
