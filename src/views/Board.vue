<template>
	<div>
		<LoadingMsg v-if="!isInitialized" />
		<UserForm v-else-if="!currentUser" />
		<div v-else class="board">
			<div class="board__header">
				<MenuBar />
			</div>
			<div :class="{ 'board__body--expand': isShowPostArea }" class="board__body">
				<GroupList class="grow-1" />
				<PostArea v-show="isShowPostArea" class="height-100 ml-20"/>
			</div>
			<PostAreaButton />
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
import PostArea from '@components/PostArea';
import PostAreaButton from '@components/PostAreaButton';
export default {
	components: {
		Group,
		GroupList,
		LoadingMsg,
		MenuBar,
		TrashCan,
		UserForm,
		PostArea,
		PostAreaButton,
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
			'isShowPostArea',
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
.board {
	height: 100vh;
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	padding: 20px 15px;
	&__header {
		margin-bottom: 20px;
	}
	&__body {
		flex-grow: 1;
		display: flex;
		overflow: hidden;
	}
	&--expand {

	}
}
</style>
