<template>
	<div>
		<LoadingMsg v-if="!isInitialized" />
		<template v-else>
			<div :class="{ 'board--expand': !isShowPostArea }" class="board">
				<div class="board__header">
					<MenuBar />
				</div>
				<div class="board__body">
					<div class="board__group-list-container">
						<GroupList class="" />
					</div>
					<div ref="postAreaContainer" class="board__post-area-container">
						<PostArea class="ml-15"/>
					</div>
				</div>
				<PostAreaButton class="board__btn-post-area" />
			</div>
			<ModalUserForm :is-open="!currentUser && !isGuestMode" />
		</template>
	</div>
</template>

<script>
import Group from '@components/Group';
import GroupList from '@components/GroupList';
import LoadingMsg from '@components/LoadingMsg';
import MenuBar from '@components/MenuBar';
import ModalUserForm from '@components/ModalUserForm';
import PostArea from '@components/PostArea';
import PostAreaButton from '@components/PostAreaButton';
export default {
	props: {
		id: { // $route.params.id
			required: true,
		},
	},
	components: {
		Group,
		GroupList,
		LoadingMsg,
		MenuBar,
		ModalUserForm,
		PostArea,
		PostAreaButton,
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
	mounted() {
		this.init(this.id);
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
