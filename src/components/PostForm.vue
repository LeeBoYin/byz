<template>
	<div class="post-form">
		<input
			ref="input"
			v-model="content"
			type="text"
			class="post-form__input"
			placeholder="Type something..."
			@keypress.enter="submit"
		>
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
@import '~@style/custom';
.post-form {
	&__input {
		border-radius: 50px;
		background-color: $c-bright;
		&:hover,
		&:focus {
			border-color: $c-primary;
		}
	}
}
</style>
