<template>
	<ModalContent
		:is-open="isOpen"
		size="lg"
		class="modal-share"
		@close="$emit('close')">
		<div slot="body" class="modal-share__body">
			<input
				:value="shareLink"
				type="text"
				class="modal-share__input"
				readonly
				@click="onClickCopy"
			>
			<button class="btn btn--primary" @click="onClickCopy">
				<span v-if="isCopied">Copied!</span>
				<i v-else class="post__tool-item las la-copy"></i>
			</button>
		</div>
		<div slot="footer" class="modal-share__footer">
			<div class="frow row-start mr-30">
				<input
					id="option-join"
					class="mr-10"
					v-model="linkType"
					type="radio"
					value="join"
				>
				<label for="option-join">
					Invite people to join
				</label>
			</div>
			<div class="frow row-start">
				<input
					id="option-guest"
					class="mr-10"
					v-model="linkType"
					type="radio"
					value="guest"
				>
				<label for="option-guest">
					Invite people to view
				</label>
			</div>
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
			linkType: 'join',
		};
	},
	computed: {
		shareLink() {
			const link = `${ window.location.protocol }//${ window.location.host }/board/${ this.boardId }`;
			return this.linkType === 'join' ? `${ link }/join` : link;
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
