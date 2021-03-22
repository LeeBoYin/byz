<template>
	<div class="menu-bar">
		<div class="frow row-between">
			<div class="frow column-start">
				<div class="frow row-center mb-5">
					<EditableTitle
						:title="boardName"
						:disabled="isGuestMode"
						:required="true"
						:clickable="true"
						element="h1"
						placeholder="Board Name"
						class="menu-bar__title"
						@update="updateBoardName"
					/>
					<div class="menu-bar__tools ml-5">
						<button
							class="menu-bar__tool"
							v-tooltip="'Share'"
							@click="onClickShareButton"
						>
							<i class="las la-link"></i>
						</button>
						<button
							v-if="isSupportFullscreen"
							:key="+isFullScreen"
							class="menu-bar__tool"
							v-tooltip="isFullScreen ? 'Leave Fullscreen' : 'Fullscreen'"
							@click="onToggleFullscreen"
						>
							<i v-if="isFullScreen" class="las la-compress"></i>
							<i v-else class="las la-expand"></i>
						</button>
						<button
							class="menu-bar__tool"
							v-tooltip="'Create new board'"
							@click="onClickCreateBoardButton"
						>
							<i class="las la-plus"></i>
						</button>
					</div>
				</div>
				<div v-if="currentUser" class="menu-bar__user-name">Your name: {{ currentUser.name }}</div>
				<a v-if="isGuestMode" class="menu-bar__user-name" @click="leaveGuestMode">
					Guest Mode
					<i class="las la-mask"></i>
				</a>
			</div>
			<AvatarList :users="_.values(users)" :max="15" size="md"/>
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
import constants from '@/constants';
import { logEvent } from '@libs/analytics';

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
		onClickCreateBoardButton() {
			window.open(`${ constants.baseUrl }/create`);
			logEvent('create_board_button_clicked');
		},
		onClickShareButton() {
			this.isOpenModalShare = true;
			logEvent('share_button_clicked');
		},
		onToggleFullscreen() {
			if(document.fullscreenElement) {
				document.exitFullscreen();
			} else {
				document.querySelector('body').requestFullscreen();
				logEvent('fullscreen_requested');
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
