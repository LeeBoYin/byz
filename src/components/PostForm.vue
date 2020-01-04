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
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: space-between;
	max-width: 768px;
	padding: 20px;
	z-index: 99;
}

.post-form input,
.post-form .btn {
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

@media 	(max-width: 991px) {
	.post-form {
		padding: 10px;
		background: rgba(255, 244, 214, 0.7);
		border-top: 1px solid rgba(10, 10, 10, 0.04);
		-webkit-backdrop-filter: blur(7px);
	}

	.post-form input,
	.post-form .btn {
		/* input 在手機設陰影沒有用 */
		box-shadow: none;
	}

	.post-form input:hover {
		border-color: transparent;
	}

	.post-form .btn {
		margin-left: 5px;
	}
}

</style>