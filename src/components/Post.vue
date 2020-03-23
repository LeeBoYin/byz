<template>
	<div :class="{ 'post--deleting': isDeleting }" class="post" :data-post-id="post.id">
		<p class="post__content">{{ post.content }}</p>
		<div class="post__footer">
			<small v-if="post.posterName" class="post__poster">by {{ post.posterName }}</small>
			<small class="post__timestamp">{{ postTime }}</small>
		</div>
		<i class="post__handle las la-grip-lines-vertical"></i>
		<i v-if="!isDeleting" class="post__btn-delete las la-times" @click="onClickDelete"></i>
		<i v-if="isDeleting" class="post__icon-deleting las la-circle-notch la-spin la"></i>
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
	created() {
		setInterval(() => {
			if(!this.post.timestamp) {
				this.postTime = 'posting...';
				return;
			}
			this.postTime = moment(this.post.timestamp.toDate()).fromNow();
		}, 1000);
	},
	computed: {
		// postTime() {
		// 	if(!this.post.timestamp) {
		// 		return 'posting...';
		// 	}
		// 	return moment(this.post.timestamp.toDate()).fromNow();
		// },
	},
	methods: {
		onClickDelete() {
			this.isDeleting = true;
			this.deletePost(this.post.id);
		},
		...mapActions('board', [
			'deletePost',
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
	margin-bottom: 15px;
	padding: 15px 25px;
	word-break: break-all;
	&:hover {
		box-shadow: 3px 3px 0 rgba(0, 0, 0, .03),
		inset 4px 0 0 #ffeec0;
	}
	&--deleting {
		opacity: 0.5;
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
	}
	&__poster {
		flex-grow: 1;
		@include text-ellipsis;
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
	&__icon-deleting {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		font-size: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto;
	}
}
</style>
