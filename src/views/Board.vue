<template>
	<div>
		<LoadingMsg v-if="!isInitialized" />
		<template v-else>
			<div :class="{ 'board--expand': !isShowPostArea }" class="board layout-u-content-fill-height">
				<LayoutFlexColumn>
					<template #top>
						<div class="board__header">
							<MenuBar />
						</div>
					</template>
					<template #remain>
						<div class="board__body layout-u-content-fill-height">
							<div class="board__group-list-container">
								<GroupList class="" />
							</div>
						</div>
					</template>
				</LayoutFlexColumn>
			</div>
			<ModalUserForm :is-open="!currentUser && !isGuestMode" />
		</template>
	</div>
</template>

<script>
import boardStore from '@store/board';
import Group from '@components/Group';
import GroupList from '@components/GroupList';
import LoadingMsg from '@components/LoadingMsg';
import MenuBar from '@components/MenuBar';
import ModalUserForm from '@components/ModalUserForm';
import { logEvent } from '@libs/analytics';
export default {
	props: {
		id: { // $route.params.id
			required: true,
		},
		action: { // $route.params.action
			required: false,
		},
	},
	components: {
		Group,
		GroupList,
		LoadingMsg,
		MenuBar,
		ModalUserForm,
	},
	data() {
		return {
			newName: '',
		};
	},
	computed: {
		...mapState('board', [
			'isInitialized',
			'isGuestMode',
			'isShowPostArea',
		]),
		...mapGetters('board', [
			'currentUser',
		]),
	},
	watch: {
		id() {
			window.location.reload();
		},
		isShowPostArea() {
			this.setPostAreaMargin();
		},
	},
	beforeCreate() {
		this.$store.registerModule('board', boardStore);
	},
	async mounted() {
		await this.init({
			boardId: this.id,
			action: this.action,
		});
		logEvent('board_loaded', {
			is_guest_mode: this.isGuestMode,
			is_user_joined: !!this.currentUser,
		});
	},
	destroyed() {
		this.$store.unregisterModule('board');
	},
	methods: {
		setPostAreaMargin() {
			if(this.isShowPostArea) { // show
				this.$refs.postAreaContainer.style.marginLeft = '';
			} else { // hide
				this.$refs.postAreaContainer.style.marginLeft = `-${ this.$refs.postAreaContainer.offsetWidth }px`;
			}
		},
		...mapActions('board', [
			'init',
			'renameBoard',
		]),
	},
};
</script>
