<template>
	<div class="post-form">
		<label>
			<input ref="input" type="text" placeholder="Type something..." v-model="content" @keypress.enter="submit">
		</label>
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
		...mapState('board', [
			'isShowPostArea',
		]),
		...mapGetters('board', [
			'currentUser',
		]),
	},
	watch: {
		isShowPostArea() {
			if(this.isShowPostArea) {
				// auto focus input when open post area
				this.$refs.input.focus();
			}
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
	input {
		flex-grow: 1;
		display: block;
		width: 100%;
		min-width: auto;
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
		input:hover {
			border-color: transparent;
		}
	}
}

</style>
