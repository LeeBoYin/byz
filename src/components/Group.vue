<template>
	<div :class="{ 'group--deleting': isDeleting }" class="group" :data-group-id="group.id">
		<EditableTitle :title="group.name" element="h2" class="group__title" @update="updateGroupName" />
		<PostList :data-group-id="group.id" :group-id="group.id" :posts="posts" class="group__post-list" />
		<i v-if="!isDeleting" class="group__btn-delete las la-times" @click="onClickDelete"></i>
	</div>
</template>

<script>
import EditableTitle from '@components/EditableTitle';
import PostList from '@components/PostList';
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
			this.$el.addEventListener('transitionend', () => {
				this.deleteGroup(this.group.id);
			});
			this.isDeleting = true;
			this.$nextTick(() => {
				this.$el.style.marginRight = `-${ this.$el.offsetWidth }px`;
			});
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
	display: flex;
	flex-direction: column;
	padding: 10px;
	transform-origin: top left;
	&--deleting {
		opacity: 0.5;
		transition: .3s ease-out;
		transform: scale(0);
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
}
</style>
