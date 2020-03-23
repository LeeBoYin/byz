<template>
	<div>
		<LoadingMsg v-if="!isInitialized" />
		<UserForm v-else-if="!currentUser" />
		<div v-else id="board">
			<MenuBar id="menu-bar" />
			<GroupList id="group-list" />
			<NewPostArea />
<!--			<TrashCan />-->
		</div>
	</div>
</template>

<script>
import Group from '@components/Group';
import GroupList from '@components/GroupList';
import LoadingMsg from '@components/LoadingMsg';
import MenuBar from '@components/MenuBar';
import TrashCan from '@components/TrashCan';
import UserForm from '@components/UserForm';
import NewPostArea from '@components/NewPostArea';
export default {
	components: {
		Group,
		GroupList,
		LoadingMsg,
		MenuBar,
		TrashCan,
		UserForm,
		NewPostArea,
	},
	data() {
		return {
			newName: '',
		};
	},
	computed: {
		id() {
			return this.$route.params.id;
		},
		...mapState('board', [
			'isInitialized',
		]),
		...mapGetters('board', [
			'currentUser',
		]),
	},
	mounted() {
		this.init(this.id);
	},
	methods: {
		...mapActions('board', [
			'init',
			'renameBoard',
		]),
	},
};
</script>

<style lang="scss">
#board {
	height: 100vh;
	display: grid;
	grid-template-columns: 1fr 300px;
	grid-template-rows: 40px 1fr;
	grid-template-areas:
			"menuBar	menuBar"
			"groupList	newPostArea"
	;
	grid-gap: 20px;
	margin: 0 auto;
	padding: 20px 15px;
}
#menu-bar {
	grid-area: menuBar;
}
#group-list {
	grid-area: groupList;
}
#new-post-area {
	grid-area: newPostArea;
}
</style>
