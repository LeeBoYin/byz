<template>
	<div id="board">
		<LoadingMsg v-if="!isInitialized" />
		<UserForm v-else-if="!currentUser" />
		<template v-else>
			<MenuBar id="menu-bar" />
			<GroupList id="group-list" />
			<PostList id="new-post-list" :posts="newPosts" />
			<PostForm />
			<TrashCan />
		</template>
	</div>
</template>

<script>
import Group from '../components/Group';
import GroupList from '../components/GroupList';
import LoadingMsg from '../components/LoadingMsg';
import MenuBar from '../components/MenuBar';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
import TrashCan from '../components/TrashCan';
import UserForm from '../components/UserForm';
export default {
	components: {
		Group,
		GroupList,
		LoadingMsg,
		MenuBar,
		PostForm,
		PostList,
		TrashCan,
		UserForm,
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
			'newPosts',
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

<style scoped>
	#board {
		display: grid;
		grid-template-columns: 1fr 300px;
		grid-template-rows: 60px 1fr;
		grid-template-areas:
				"menuBar	menuBar"
				"groupList	newGroup"
		;
		grid-gap: 20px;
		margin: 0 auto;
		padding: 20px 15px;
	}
	#menu-bar {
		grid-area: menuBar;
	}
	#new-post-list {
		grid-area: newGroup;
	}
	#group-list {
		grid-area: groupList;
	}
</style>