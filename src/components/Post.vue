<template>
	<div class="post">
		<p>{{ post.content }}</p>
	</div>
</template>

<script>
export default {
	name: 'Post',
	props: {
		post: Object,
	},
	computed: {
		// postTime() {
		// 	return moment(this.post.timestamp.toDate()).format();
		// },
	},
}
</script>

<style scoped>
.post {
	border: 1px solid #EEE;
	border-radius: 4px;
	padding: 10px 20px;
}
</style>