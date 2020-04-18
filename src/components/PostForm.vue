<template>
	<div class="post-form">
		<textarea
			ref="input"
			v-model.trim="content"
			v-auto-focus
			v-auto-height
			rows="1"
			class="post-form__input"
			placeholder="Type something..."
			@keypress.enter="submit"
		>
		</textarea>
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
		async submit(e) {
			if(e.ctrlKey || e.shiftKey || e.altKey) {
				// 換行
				return;
			}
			e.preventDefault();
			if(!this.isSubmittable) {
				return;
			}
			this.createPost({
				content: this.content,
				timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				posterName: this.currentUser.name,
			});
			this.content = '';
			this.$refs.input.style.height = 'auto';
			this.$refs.input.focus();
		},
		...mapActions('board', [
			'createPost',
		]),
	},
};
</script>
