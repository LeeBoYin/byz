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
				class="group__title"
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
import { transitionendOnce } from '@libs/uiUtils';
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
					isDisabled: this.posts.length < 2,
					isShow: true,
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
		executeDelete() {
			transitionendOnce(this.$el, () => {
				this.deleteGroup( this.group.id );
			});
			this.isDeleting = true;
			this.$nextTick(() => {
				this.$el.style.marginRight = `-${ this.$el.offsetWidth }px`;
			});
		},
		onClickDelete() {
			if(!this.posts.length) {
				this.executeDelete();
				return;
			}
			this.$confirm({
				msg: `All posts in ${ this.group.name } will be deleted`,
				buttonText: 'Delete',
				onConfirm: () => {
					this.executeDelete();
				},
			});
		},
		onClickEditTitle() {
			setTimeout(() => {
				this.$refs.editableTitle.onEdit();
			}, 10);
		},
		onClickSortPosts() {
			const sortedPostIdList = _.map(_.sortBy(this.posts, (post) => {
				return -_.get(post, 'likedUsersId', []).length;
			}), 'id');
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
