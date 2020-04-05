<template>
	<button class="btn-post-area" @click="setIsShowPostArea(true)">
		<i class="las la-comment-medical"></i>
		<div v-if="newPosts.length" class="btn-post-area__new-post-num">
			{{ newPosts.length }}
		</div>
	</button>
</template>

<script>
export default {
	computed: {
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

<style lang="scss" scoped>
@import '~@style/custom';
.btn-post-area {
	@extend .btn;
	@extend .btn--primary;
	position: fixed;
	bottom: 30px;
	right: 30px;
	font-size: 30px;
	padding: 15px;
	border-radius: 50%;
	box-shadow: 0 3px 5px 0 rgba(0, 0, 0, 0.3);
	&__new-post-num {
		position: absolute;
		top: -5px;
		right: -5px;
		padding: 6px 8px;
		min-width: 24px;
		border-radius: 12px;
		background-color: #ff4c4c;
		font-size: 12px;
		line-height: 1;
		animation: notification-appear .2s ease-out;
		animation-iteration-count: 1;
	}
}
@keyframes notification-appear {
	0% {
		transform: scale(0);
	}
	80% {
		transform: scale(1.2);
	}
	100% {
		transform: scale(1);
	}
}
</style>
