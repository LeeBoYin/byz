<template>
	<button class="post-area-button" @click="setIsShowPostArea(true)">
		<i class="las la-comment-medical"></i>
		<span v-if="newPosts.length" class="post-area-button__new-post-num">
			{{ newPosts.length }}
		</span>
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
