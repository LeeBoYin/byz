<template>
	<button class="post-area-button btn btn--primary" @click="setIsShowPostArea(true)">
		<i class="las la-comment-medical"></i>
		<div v-if="newPosts.length" class="post-area-button__new-post-num">
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
