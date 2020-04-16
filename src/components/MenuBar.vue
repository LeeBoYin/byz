<template>
	<div class="menu-bar">
		<div class="frow row-between">
			<div class="frow column-start">
				<div class="frow row-center mb-5">
					<EditableTitle
						:title="boardName"
						:disabled="isGuestMode"
						element="h1"
						placeholder="Board Name"
						class="menu-bar__title"
						@update="updateBoardName"
					/>
					<div class="menu-bar__tools ml-5">
						<button class="menu-bar__tool" @click="isOpenModalShare = true">
							<i class="las la-link"></i>
						</button>
						<button v-if="isSupportFullscreen" class="menu-bar__tool" @click="onToggleFullscreen">
							<i v-if="isFullScreen" class="las la-compress"></i>
							<i v-else class="las la-expand"></i>
						</button>
					</div>
				</div>
				<div v-if="currentUser" class="menu-bar__user-name">Your name: {{ currentUser.name }}</div>
				<a v-if="isGuestMode" class="menu-bar__user-name" @click="leaveGuestMode">
					Guest Mode
					<i class="las la-mask"></i>
				</a>
			</div>
			<AvatarList :users="users" :max="15" size="md"/>
		</div>
		<ModalShare
			:is-open="isOpenModalShare"
			class="modal-sm"
			@close="isOpenModalShare = false"
		/>
	</div>
</template>

<script>
import AvatarList from '@components/AvatarList';
import EditableTitle from '@components/EditableTitle';
import ModalShare from '@components/ModalShare';

export default {
	components: {
		AvatarList,
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
		...mapState('board', [
			'isGuestMode',
		]),
		...mapGetters('board', [
			'boardName',
			'currentUser',
			'users',
		]),
	},
	mounted() {
		document.addEventListener('fullscreenchange', () => {
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
			'leaveGuestMode',
			'updateBoard',
		]),
	},
};
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.menu-bar {
	&__title {
		font-size: 16px;
	}
	&__user-name {
		font-size: 12px;
		color: $c-gray;
	}
	&__tools {

	}
	&__tool {
		font-size: 16px;
		margin-left: 10px;
	}
}
</style>
