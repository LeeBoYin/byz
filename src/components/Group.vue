<template>
	<div :class="{ 'group--deleting': isDeleting }" class="group" :data-group-id="group.id">
		<EditableTitle
			:title="group.name"
			element="h2"
			placeholder="Group Name"
			class="group__title"
			@update="updateGroupName"
		/>
		<PostList :data-group-id="group.id" :group-id="group.id" :posts="posts" class="group__post-list" />
		<i v-if="!isDeleting" class="group__btn-delete las la-times" @click="onClickDelete"></i>
		<i class="group__handle las la-grip-lines-vertical"></i>
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
%tool-group {
	@extend %tool;
	position: absolute;
	top: 0;
	z-index: 1;
	padding: 24px 2px;
}
.group {
	position: relative;
	background-color: rgba(0, 0, 0, 0.03);
	display: flex;
	flex-direction: column;
	padding-bottom: 6px;
	border-radius: $border-r-md;
	transform-origin: top left;
	&--deleting {
		opacity: 0.5;
		transition: .3s ease-out;
		transform: scale(0);
	}
	&__title {
		padding: 16px 24px;
	}
	&__post-list {
		flex-grow: 1;
	}
	&__btn-delete {
		@extend %tool-group;
		right: 0;
	}
	&__handle {
		@extend %tool-group;
		@extend %handle;
		left: 0;
	}
}
</style>
