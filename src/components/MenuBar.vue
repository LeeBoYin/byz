<template>
	<div class="menu-bar">
		<EditableTitle tag="h1" :title="boardName" @update="updateBoardName" />
	</div>
</template>

<script>
import EditableTitle from './EditableTitle';
export default {
	components: {
		EditableTitle,
	},
	computed: {
		...mapGetters('board', [
			'boardName',
		]),
	},
	methods: {
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

<style scoped>
.menu-bar {
	display: flex;
	align-items: center;
}
h1 {
	margin: 0;
}
</style>