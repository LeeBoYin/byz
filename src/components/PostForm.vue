<template>
	<div class="post-form">
		<label>
			<input ref="input" type="text" placeholder="Type something..." v-model="content" @keypress.enter="submit">
		</label>
<!--		<button class="btn" :disabled="!isSubmittable" @click="submit">Post</button>-->
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

<style lang="scss" scoped>
.post-form {
	display: flex;
	justify-content: space-between;
	/*max-width: 768px;*/
	/*padding: 20px;*/

	input,
	.btn {
		/*box-shadow: 0 2px 20px 2px rgba(0, 0, 0, 0.15);*/
	}
	input {
		flex-grow: 1;
		display: block;
		width: 100%;
		min-width: auto;
	}
	.btn {
		margin-left: 10px;
	}
	label {
		display: block;
		width: 100%;
	}
}
@media 	(max-width: 991px) {
	.post-form {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 99;
		padding: 10px;
		background: rgba(255, 244, 214, 0.7);
		border-top: 1px solid rgba(10, 10, 10, 0.04);
		-webkit-backdrop-filter: blur(7px);

		input,
		.btn {
			/* input 在手機設陰影沒有用 */
			/*box-shadow: none;*/
		}
		input:hover {
			border-color: transparent;
		}
		.btn {
			margin-left: 5px;
		}
	}
}

</style>
