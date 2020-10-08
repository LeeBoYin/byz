<template>
	<button
		class="image-upload-button"
		:class="{ 'image-upload-button--loading': isUploading }"
	>
		<i v-if="isUploading" class="las la-circle-notch la-spin la"></i>
		<i v-else class="las la-image"></i>
		<input
			type="file"
			class="image-upload-button__input"
			@click="onClick"
			@change="onImageSelected"
			accept="image/*"
			title=""
		/>
	</button>
</template>

<script>
import { uploadFile } from '@libs/storage';
import Compressor from 'compressorjs';
export default {
	props: {
		maxHeight: {
			type: Number,
			default: null,
		},
		maxWidth: {
			type: Number,
			default: null,
		},
		quality: {
			type: Number,
			default: 0.8,
		},
		path: {
			type: String,
			required: true,
		},
	},
	data() {
		return {
			isUploading: false,
		};
	},
	methods: {
		onClick(e) {
			if(this.isUploading) {
				e.preventDefault();
			}
		},
		async onImageSelected(e) {
			const file = e.target.files[0];
			if (!file || this.isUploading) {
				return;
			}
			try {
				this.isUploading = true;
				// compress image
				const compressedFile = await new Promise((resolve) => {
					new Compressor(file, {
						quality: this.quality,
						convertSize: 0, // convert all png to jpeg
						maxHeight: this.maxHeight,
						maxWidth: this.maxWidth,
						success(result) {
							resolve(result);
						},
						error(err) {
							throw err.message;
						},
					});
				});
				// clear input
				e.target.value = '';
				// upload
				const photoURL = await uploadFile({
					path: this.path,
					file: compressedFile,
					fileName: file.name,
					onStateChange: (payload) => {
						this.$emit('uploading', payload)
					},
				});
				this.$emit('uploaded', {
					photoURL,
					fileName: file.name,
				});
			} catch (errorMessage) {
				console.error(errorMessage);
			} finally {
				this.isUploading = false;
			}
		},
	},
};
</script>
