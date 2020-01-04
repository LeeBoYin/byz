<template>
	<div class="group" :data-group-id="group.id">
		<EditableTitle tag="h2" :title="group.name" @update="updateGroupName" />
		<PostList :data-group-id="group.id" :group-id="group.id" :posts="posts" />
	</div>
</template>

<script>
import EditableTitle from './EditableTitle';
import PostList from './PostList';
export default {
	components: {
		EditableTitle,
		PostList,
	},
	props: {
		group: Object,
	},
	computed: {
		posts() {
			return this.getPostsByGroupId(this.group.id);
		},
		...mapGetters('board', [
			'getPostsByGroupId',
		]),
	},
	methods: {
		updateGroupName(newName) {
			this.updateGroup({
				groupId: this.group.id,
				updateObj: {
					name: newName,
				},
			});
		},
		...mapActions('board', [
			'updateGroup',
		]),
	},
};
</script>

<style scoped>
.group {
	background-color: #f2e8cb;
	flex: 0 0 300px;
	margin-right: 15px;
	padding: 10px;
}
</style>