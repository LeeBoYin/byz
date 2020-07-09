<template>
	<ModalContent
		:is-open="isOpen"
		class="modal-share"
		@close="$emit('close')">
		<div slot="body" class="modal-share__body">
			<input :value="shareLink" type="text" class="modal-share__input" disabled>
			<button class="btn btn--primary" @click="onClickCopy">
				<span v-if="isCopied">Copied!</span>
				<i v-else class="post__tool-item las la-copy"></i>
			</button>
		</div>
	</ModalContent>
</template>

<script>
import setStringToClipBoard from 'set-string-to-clipboard';
import ModalContent from '@components/ModalContent';
export default {
	components: {
		ModalContent,
	},
	props: ['isOpen'],
	data() {
		return {
			isCopied: false,
		};
	},
	computed: {
		shareLink() {
			return `${ window.location.protocol }//${ window.location.host }/board/${ this.boardId }`;
		},
		...mapGetters('board', [
			'boardId',
		]),
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
