<template>
	<div :class="{ 'group--deleting': isDeleting, 'group--guest': isGuestMode }" class="group" :data-group-id="group.id">
		<div class="frow nowrap">
			<i class="group__handle las la-grip-lines-vertical"></i>
			<EditableTitle
				ref="editableTitle"
				:title="group.name"
				:disabled="isGuestMode"
				element="h2"
				placeholder="Group Name"
				class="group__title grow-1"
				@update="updateGroupName"
			/>
			<OptionsDropdown :options="options" direction="bottom" class="group__options" />
		</div>
		<PostList :data-group-id="group.id" :group-id="group.id" :posts="posts" class="group__post-list" />
	</div>
</template>

<script>
import EditableTitle from '@components/EditableTitle';
import OptionsDropdown from '@components/OptionsDropdown';
import PostList from '@components/PostList';
export default {
	components: {
		EditableTitle,
		OptionsDropdown,
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
		options() {
			const options = [
				{
					title: 'Sort',
					iconClass: 'las la-sort-amount-up',
					onClick: this.onClickSortPosts,
					isShow: this.posts.length > 1,
				},
				{
					title: 'Edit Title',
					iconClass: 'las la-pencil-alt',
					onClick: this.onClickEditTitle,
					isShow: false,
				},
				{
					title: 'Delete Group',
					iconClass: 'las la-trash-alt',
					onClick: this.onClickDelete,
					isDanger: true,
					isShow: true,
				},
			];
			return _.filter(options, 'isShow');
		},
		posts() {
			return this.getPostsByGroupId(this.group.id);
		},
		...mapState('board', [
			'isGuestMode',
		]),
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
		onClickEditTitle() {
			setTimeout(() => {
				this.$refs.editableTitle.onEdit();
			}, 10);
		},
		onClickSortPosts() {
			const sortedPostIdList = _.map(_.sortBy(this.posts, (post) => {
				return _.get(post, 'likedUsers', []).length;
			}), 'id').reverse();
			this.updateGroup({
				groupId: this.group.id,
				updateObj: {
					postIdList: sortedPostIdList,
				},
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
	font-size: 24px;
	padding: 22px 0px;
}
.group {
	position: relative;
	background-color: rgba(0, 0, 0, 0.03);
	display: flex;
	flex-direction: column;
	padding-bottom: 6px;
	border-radius: $border-r-md;
	width: $w-group;
	transform-origin: top left;
	&--deleting {
		opacity: 0.5;
		transition: .3s ease-out;
		transform: scale(0);
	}
	&__title {
		padding: 16px 0px;
		overflow: hidden;
	}
	&__post-list {
		flex-grow: 1;
	}
	&__options {
		@extend %tool;
		@extend %tool-group;
		right: 0;
	}
	&__handle {
		@extend %tool;
		@extend %tool-group;
		@extend %handle;
		left: 0;
	}
	// guest mode style
	&--guest &__options,
	&--guest &__handle {
		visibility: hidden;
	}
}
</style>
