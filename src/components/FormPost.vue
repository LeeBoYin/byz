<template>
	<div class="form-post">
		<h2>Create New Post</h2>
		<label>
			Type Something:
			<input ref="input" type="text" v-model="content" @keydown.enter="submit">
		</label>
		<button :disabled="!isSubmittable" @click="submit">Post</button>
		<div v-if="isLoading">Posting...</div>
	</div>
</template>

<script>
export default {
	name: 'FormPost',
	data() {
		return {
			content: '',
			isLoading: false,
		};
	},
	computed: {
		isSubmittable() {
			return this.content.length > 0;
		},
	},
	methods: {
		async submit() {
			if(!this.isSubmittable) {
				return;
			}
			const post = {
				content: this.content,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			};
			this.content = '';
			this.$refs.input.focus();
			this.isLoading = true;
			await this.createPost(post);
			this.isLoading = false;

		},
		...mapActions('board', [
			'createPost',
		]),
	},
}
</script>

<style scoped>
.form-post {
	border: 1px solid #EAEAEA;
	border-radius: 4px;
	padding: 10px 20px;
	margin: 10px 0;
}
</style>