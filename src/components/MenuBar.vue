<template>
	<div class="menu-bar">
		<EditableTitle :title="boardName" element="h1" class="menu-bar__title" @update="updateBoardName" />
		<div class="menu-bar__tools">
			<button class="menu-bar__tool" @click="isOpenModalShare = true">
				<i class="las la-share"></i>
			</button>
			<button v-if="isSupportFullscreen" class="menu-bar__tool" @click="onToggleFullscreen">
				<i v-if="isFullScreen" class="las la-compress"></i>
				<i v-else class="las la-expand"></i>
			</button>
		</div>
		<ModalShare :is-open="isOpenModalShare" @close="isOpenModalShare = false" />
	</div>
</template>

<script>
import EditableTitle from '@components/EditableTitle';
import ModalShare from '@components/ModalShare';

export default {
	components: {
		EditableTitle,
		ModalShare,
	},
	data() {
		return {
			isSupportFullscreen: document.fullscreenEnabled,
			isOpenModalShare: false,
			isFullScreen: false,
		};
	},
	computed: {
		...mapGetters('board', [
			'boardName',
		]),
	},
	mounted() {
		document.addEventListener('fullscreenchange', (e) => {
			this.isFullScreen = !!document.fullscreenElement;
		});
	},
	methods: {
		onToggleFullscreen() {
			if(document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				document.getElementsByTagName('body')[0].requestFullscreen();
			}
		},
		updateBoardName(newName) {
			this.updateBoard({
				name: newName,
			});
		},
		...mapActions('board', [
			'updateBoard'
		]),
	},
};
</script>

<style lang="scss" scoped>
.menu-bar {
	display: flex;
	align-items: center;
	&__title {
		flex-grow: 1;
		font-size: 2rem;
	}
	&__tools {

	}
	&__tool {
		font-size: 2rem;
		margin-left: 10px;
	}
}
</style>
