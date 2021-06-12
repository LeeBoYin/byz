<template>
	<div class="menu-bar">
		<LayoutFlexRow vertical-align="center">
			<template #left>
				<LayoutList gap="1" horizontal-align="left">
					<LayoutListInline gap="2" vertical-align="center">
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
						<LayoutListInline gap="1" vertical-align="center">
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
						</LayoutListInline>
					</LayoutListInline>
					<div v-if="currentUser" class="menu-bar__user-name">Your name: {{ currentUser.name }}</div>
					<a v-if="isGuestMode" class="menu-bar__user-name" @click="leaveGuestMode">
						Guest Mode
						<i class="las la-mask"></i>
					</a>
				</LayoutList>
			</template>
			<template #right>
				<AvatarList :users="formattedUserList" :max="15" size="md"/>
			</template>
		</LayoutFlexRow>
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
			formattedUserList: [],
			updateUserListInterval: null,
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
	watch: {
		currentUser() {
			if(this.currentUser.lastActiveTimestamp) {
				// update as soon as current user is active
				this.updateFormattedUserList();
			}
		},
	},
	created() {
		this.updateFormattedUserList();
		this.updateUserListInterval = setInterval(this.updateFormattedUserList, 10 * 1000);
	},
	mounted() {
		document.addEventListener('fullscreenchange', () => {
			this.isFullScreen = !!document.fullscreenElement;
		});
	},
	beforeDestroy() {
		clearInterval(this.updateUserListInterval);
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
		updateFormattedUserList() {
			this.formattedUserList = _(_.values(this.users))
				.map(user => {
					const inactiveMinutes = user.lastActiveTimestamp ? moment().diff(moment(user.lastActiveTimestamp.toDate()), 'seconds') : Infinity;
					const inactive = inactiveMinutes >= constants.inactiveThresholdSecond;
					return {
						inactive,
						inactiveMinutes,
						...user,
					};
				})
				.sortBy(user => {
					// sort all active users to the front
					if(!user.inactive) {
						return 0;
					}
					// sort inactive users by inactive time
					return user.inactiveMinutes;
				})
				.value();
		},
		...mapActions('board', [
			'leaveGuestMode',
			'updateBoard',
		]),
	},
};
</script>
