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
			@keydown.esc="cancel"
		>
		</textarea>
	</div>
</template>

<script>
export default {
	props: {
		groupId: {
			type: String,
			required: true,
		},
	},
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
	mounted() {
		this.bindEvents();
	},
	beforeDestroy() {
		document.removeEventListener('mousedown', this.onDocumentClick);
	},
	methods: {
		bindEvents() {
			document.addEventListener('mousedown', this.onDocumentClick);
		},
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
				post: {
					content: this.content,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					posterName: this.currentUser.name,
				},
				groupId: this.groupId,
			});
			this.$emit('posted');
			this.content = '';
			this.$refs.input.style.height = 'auto';
			this.$refs.input.focus();
		},
		cancel() {
			this.$emit('cancel');
		},
		onDocumentClick(e) {
			if(this.content.length || e.target.isEqualNode(this.$refs.input)){
				return;
			}
			this.cancel();
		},
		...mapActions('board', [
			'createPost',
		]),
	},
};
</script>
