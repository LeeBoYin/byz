<template>
	<div class="menu-bar">
		<LayoutFlexRow vertical-align="center" gap="2" padding="2">
			<template #remain>
				<LayoutAlign horizontal-align="left">
					<LayoutList gap="1" horizontal-align="">
						<LayoutFlexRow gap="2" vertical-align="center">
							<template #remain>
								<EditableTitle
									:title="boardName"
									:disabled="isGuestMode"
									:required="true"
									:clickable="!!currentUser"
									element="h1"
									placeholder="Board Name"
									class="menu-bar__title"
									auto-width
									@update="updateBoardName"
								/>
							</template>
							<template #right>
								<LayoutListInline
									gap="1"
									vertical-align="center"
									:wrap="false"
								>
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
										v-tooltip="'Switch theme'"
										@click="onClickToggleTheme"
									>
										<i class="las la-sun menu-bar__tool-icon--light-mode"></i>
										<i class="las la-moon menu-bar__tool-icon--dark-mode"></i>
									</button>
									<button
										class="menu-bar__tool"
										v-tooltip="'Create a new board'"
										@click="onClickCreateBoardButton"
									>
										<i class="las la-plus"></i>
									</button>
									<button
										class="menu-bar__tool"
										v-tooltip="'About'"
										@click="onClickAboutButton"
									>
										<i class="las la-info-circle"></i>
									</button>
								</LayoutListInline>
							</template>
						</LayoutFlexRow>
						<div v-if="currentUser" class="menu-bar__user-name">Your name: {{ currentUser.name }}</div>
						<a v-if="isGuestMode" class="menu-bar__user-name" @click="leaveGuestMode">
							Guest Mode
							<i class="las la-mask"></i>
						</a>
					</LayoutList>
				</LayoutAlign>
			</template>
			<template #right>
				<AvatarList
					:users="formattedUserList"
					:max="15"
					size="md"
					class="menu-bar__avatar-list"
				/>
				<Avatar
					v-if="currentUser"
					:color="currentUser.color"
					:name="currentUser.name"
					size="md"
					class="menu-bar__avatar"
				/>
			</template>
		</LayoutFlexRow>
		<ModalAbout
			:is-open="isOpenModalAbout"
			@close="isOpenModalAbout = false"
		/>
		<ModalShare
			:is-open="isOpenModalShare"
			@close="isOpenModalShare = false"
		/>
	</div>
</template>

<script>
import Avatar from '@components/Avatar';
import AvatarList from '@components/AvatarList';
import EditableTitle from '@components/EditableTitle';
import ModalAbout from '@components/ModalAbout';
import ModalShare from '@components/ModalShare';
import constants from '@/constants';
import { logEvent } from '@libs/analytics';
import {
	toggleColorScheme,
	storeUserPreferredColorScheme,
} from '@libs/colorScheme';

export default {
	components: {
		Avatar,
		AvatarList,
		EditableTitle,
		ModalAbout,
		ModalShare,
	},
	data() {
		return {
			formattedUserList: [],
			updateUserListInterval: null,
			isSupportFullscreen: document.fullscreenEnabled,
			isOpenModalAbout: false,
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
		onClickAboutButton() {
			this.isOpenModalAbout = true;
			logEvent('about_button_clicked');
		},
		onClickCreateBoardButton() {
			window.open(`${ constants.baseUrl }/create`);
			logEvent('create_board_button_clicked');
		},
		onClickShareButton() {
			this.isOpenModalShare = true;
			logEvent('share_button_clicked');
		},
		onClickToggleTheme() {
			const colorScheme = toggleColorScheme();
			storeUserPreferredColorScheme(colorScheme);
			logEvent('switch_theme', {
				theme: colorScheme,
			})
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
