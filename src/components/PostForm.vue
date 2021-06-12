<template>
	<div class="post-form">
		<LayoutFlexRow vertical-align="top" gap="1">
			<template #remain>
				<div class="layout-u-position-relative">
					<textarea
						ref="input"
						v-model.trim="content"
						v-auto-focus
						v-auto-height
						rows="1"
						class="post-form__input"
						placeholder="Type something..."
						:disabled="isPosting"
						@keypress.enter="submit"
						@keydown.esc="cancel"
					>
					</textarea>
					<LayoutAbsolute
						v-if="isPosting"
						padding-x="2"
					>
						<template #right>
							<div class="post-form__icon-loading">
								<i class="las la-circle-notch la-spin la"></i>
							</div>
						</template>
					</LayoutAbsolute>
				</div>
			</template>
			<template #right>
				<ImageUploadButton
					class="post-form__tool"
					:path="`board/${ boardId }/image`"
					:maxHeight="1920"
					:maxWidth="1920"
					@uploading="isUploadingImage = true"
					@uploaded="onImageUploaded"
				/>
			</template>
		</LayoutFlexRow>
	</div>
</template>

<script>
import ImageUploadButton from '@components/ImageUploadButton';
export default {
	components: {
		ImageUploadButton,
	},
	props: {
		groupId: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			content: '',
			isPosting: false,
			isUploadingImage: false,
		};
	},
	computed: {
		isSubmittable() {
			return this.content.length > 0 && !this.isUploadingImage;
		},
		...mapGetters('board', [
			'currentUser',
			'boardId',
		]),
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
			this.isPosting = true;
			await this.createPost({
				post: {
					content: this.content,
					posterName: this.currentUser.name,
				},
				groupId: this.groupId,
			}).then(() => {
				this.isPosting = false;
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
			if(this.content.length || _.some(e.path, node => node.isEqualNode && node.isEqualNode(this.$el))){
				return;
			}
			this.cancel();
		},
		onImageUploaded({ photoURL, fileName }) {
			this.content += `![${ fileName }](${ photoURL })`;
			this.isUploadingImage = false;
			this.$nextTick(() => {
				this.$refs.input.dispatchEvent(new Event('input'));
				this.$refs.input.focus();
			});
		},
		...mapActions('board', [
			'createPost',
		]),
	},
};
</script>
