<template>
	<li class="post" :data-post-id="post.id">
		<p>{{ post.content }}</p>
		<small v-if="post.posterName">posted by {{ post.posterName }}</small>
		<br>
		<small class="timestamp">{{ postTime }}</small>
	</li>
</template>

<script>
export default {
	props: {
		post: Object,
	},
	computed: {
		postTime() {
			if(!this.post.timestamp) {
				return 'posting...';
			}
			return moment(this.post.timestamp.toDate()).format();
		},
	},
};
</script>

<style scoped>
.post {
	background-color: #FFF;
	border-radius: 10px;
	box-shadow: 3px 3px 0 rgba(0, 0, 0, .03);
	display: block;
	margin-bottom: 15px;
	padding: 15px 20px;
	word-break: break-all;
}

.post:hover {
	box-shadow: 3px 3px 0 rgba(0, 0, 0, .03),
				inset 4px 0 0 #ffeec0;
}

.post p {
	color: #333;
	font-size: 16px;
	margin-top: 0;
	max-height: 100px;
	overflow: auto;
	/*overscroll-behavior: none;*/
}

.post small {
	color: #999;
}
</style>