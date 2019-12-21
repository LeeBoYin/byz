<template>
	<div class="post-form">
		<label>
			<input ref="input" type="text" placeholder="Type something..." v-model="content" @keypress.enter="submit">
		</label>
		<a class="btn" :disabled="!isSubmittable" @click="submit">Post</a>
	</div>
</template>

<script>
export default {
	data() {
		return {
			content: '',
		};
	},
	computed: {
		isSubmittable() {
			return this.content.length > 0;
		},
		...mapGetters('board', [
			'currentUser',
		]),
	},
	methods: {
		async submit() {
			if(!this.isSubmittable) {
				return;
			}
			const post = {
				content: this.content,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				posterName: this.currentUser.name,
			};
			this.content = '';
			this.$refs.input.focus();
			this.createPost(post);
		},
		...mapActions('board', [
			'createPost',
		]),
	},
};
</script>

<style scoped>
.post-form {
	position: fixed;
	left: 0;
	bottom: 0;
	display: flex;
	justify-content: space-between;
	width: 100vw;
	max-width: 800px;
	padding: 20px;
	z-index: 99;
}

.post-form input,
.post-form button {
	box-shadow: 0 2px 20px 2px rgba(0, 0, 0, 0.15);
	outline: none;
}

.post-form label {
	display: block;
	width: 100%;
}

.post-form input {
	flex-grow: 1;
	display: block;
	width: 100%;
}

.post-form input:hover,
.post-form input:focus{
	border-color: #ffa100;
}

.post-form .btn {
	margin-left: 10px;
}
</style>