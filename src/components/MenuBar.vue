<template>
	<div class="menu-bar">
		<EditableTitle :title="boardName" element="h1" @update="updateBoardName" />
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

}
.title {
	font-size: 2rem;
	text-align: center;
}
</style>
