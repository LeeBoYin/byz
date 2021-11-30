<template>
	<ModalContent
		:is-open="isOpen"
		size="lg"
		class="modal-share"
		@close="$emit('close')">
		<div slot="body" class="modal-share__body">
			<LayoutFlexRow gap="3" padding="3">
				<template #remain>
					<input
						:value="shareLink"
						type="text"
						class="modal-share__input"
						readonly
						@click="onClickCopy"
					>
				</template>
				<template #right>
					<button class="btn btn--primary" @click="onClickCopy">
						<span v-if="isCopied">Copied!</span>
						<i v-else class="post__tool-item las la-copy"></i>
					</button>
				</template>
			</LayoutFlexRow>
		</div>
		<div v-if="!isGuestMode" slot="footer" class="modal-share__footer">
			<LayoutListInline gap="3" padding="3" vertical-align="center">
				<div>
					Invite people to
				</div>
				<label for="option-join">
					<LayoutListInline gap="2" vertical-align="center">
						<input
							id="option-join"
							v-model="linkType"
							type="radio"
							value="join"
						>
						<span>join</span>
					</LayoutListInline>
				</label>
				<label for="option-guest">
					<LayoutListInline gap="2" vertical-align="center">
						<input
							id="option-guest"
							v-model="linkType"
							type="radio"
							value="guest"
						>
						<span>view</span>
					</LayoutListInline>
				</label>
			</LayoutListInline>
		</div>
	</ModalContent>
</template>

<script>
import setStringToClipBoard from 'set-string-to-clipboard';
import ModalContent from '@components/ModalContent';
import { logEvent } from '@libs/analytics';
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
			if(this.isGuestMode) {
				return link;
			}
			return this.linkType === 'join' ? `${ link }/join` : link;
		},
		...mapState('board', [
			'isGuestMode',
		]),
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
			logEvent('share_link_copied', {
				link_type: this.linkType,
			});
		},
	},
};
</script>
