<template>
	<div :class="{ 'group--deleting': isDeleting }" class="group" :data-group-id="group.id">
		<EditableTitle :title="group.name" element="h2" class="group__title" @update="updateGroupName" />
		<PostList :data-group-id="group.id" :group-id="group.id" :posts="posts" class="group__post-list" />
		<i v-if="!isDeleting" class="group__btn-delete las la-times" @click="onClickDelete"></i>
		<i v-if="isDeleting" class="group__icon-deleting las la-circle-notch la-spin la"></i>
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
	data() {
		return {
			isDeleting: false,
		};
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
		onClickDelete() {
			this.isDeleting = true;
			this.deleteGroup(this.group.id);
		},
		updateGroupName(newName) {
			this.updateGroup({
				groupId: this.group.id,
				updateObj: {
					name: newName,
				},
			});
		},
		...mapActions('board', [
			'deleteGroup',
			'updateGroup',
		]),
	},
};
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.group {
	position: relative;
	background-color: rgba(0, 0, 0, 0.03);
	flex: 0 0 300px;
	width: 300px;
	display: flex;
	flex-direction: column;
	margin-right: 15px;
	padding: 10px;
	height: 100%;
	&--deleting {
		opacity: 0.5;
	}
	&__title {
		margin-bottom: 20px;
		cursor: grab;
		text-align: center;
		&:active {
			cursor: grabbing;
		}
	}
	&__post-list {
		flex-grow: 1;
	}
	&__btn-delete {
		position: absolute;
		top: 0;
		right: 0;
		z-index: 1;
		padding: 5px;
		cursor: pointer;
		color: #CCCCCC;
		&:hover {
			color: #999999;
		}
	}
	&__icon-deleting {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		font-size: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: auto;
	}
}
</style>
