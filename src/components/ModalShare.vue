<template>
	<Modal
		:is-open="isOpen"
		title="Share"
		class="modal-share"
		@close="$emit('close')">
		<div slot="body" class="modal-share__body">
			<input :value="shareLink" type="text" class="modal-share__input" disabled>
			<button class="modal-share__btn" @click="onClickCopy">
				<span v-if="isCopied">Copied!</span>
				<i v-else class="post__tool-item las la-copy"></i>
			</button>
		</div>
	</Modal>
</template>

<script>
import setStringToClipBoard from 'set-string-to-clipboard';
import Modal from '@components/Modal';
export default {
	components: {
		Modal,
	},
	props: ['isOpen'],
	data() {
		return {
			isCopied: false,
		};
	},
	computed: {
		shareLink() {
			return window.location.href;
		},
	},
	methods: {
		onClickCopy() {
			if(this.isCopied) {
				return;
			}
			setStringToClipBoard(this.shareLink);
			this.isCopied = true;
			setTimeout(() => {
				this.isCopied = false;
			}, 1000);
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.modal-share {
	&__body {
		padding: 15px;
		display: flex;
	}
	&__input {
		flex-grow: 1;
		margin-right: 15px;
	}
	&__btn {
		@extend .btn;
		@extend .btn--primary;
	}
}
</style>
