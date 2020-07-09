<template>
	<div
		:class="{
			'group--deleting': isDeleting,
			'group--guest': isGuestMode,
			'group--draggable': !isDeleting && !isGuestMode,
			'group--posting': isPosting,
		}"
		class="group"
		:data-group-id="group.id"
	>
		<div class="group__header frow nowrap">
			<i class="group__handle las la-grip-lines"></i>
			<EditableTitle
				ref="editableTitle"
				:title="group.name"
				:disabled="isGuestMode"
				element="h2"
				placeholder="Group Name"
				align="center"
				class="group__title"
				@update="updateGroupName"
			/>
			<OptionsDropdown :options="options" direction="bottom" class="group__options" />
		</div>
		<PostList ref="postList" :data-group-id="group.id" :group-id="group.id" :posts="posts" class="group__post-list" />
		<button v-if="!isGuestMode && !isPosting" class="group__btn-post" @click="onClickCreatePost">
			<i class="las la-plus"></i>
		</button>
		<div v-if="isPosting" class="group__post-form-area">
			<PostForm
				:group-id="group.id"
				@posted="onPosted"
				@cancel="isPosting = false"
			/>
		</div>
	</div>
</template>

<script>
import EditableTitle from '@components/EditableTitle';
import OptionsDropdown from '@components/OptionsDropdown';
import PostForm from '@components/PostForm';
import PostList from '@components/PostList';
import { scrollTopAnimate, transitionendOnce } from '@libs/uiUtils';
import { EventBus } from '@/main';
export default {
	components: {
		EditableTitle,
		OptionsDropdown,
		PostForm,
		PostList,
	},
	props: {
		group: Object,
	},
	data() {
		return {
			isDeleting: false,
			isPosting: false,
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
					isShow: true,
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
		onClickCreatePost() {
			this.isPosting = true;
		},
		onClickDelete() {
			if(!this.posts.length) {
				this.executeDelete();
				return;
			}
			this.$confirm({
				msg: `All posts in ${ this.group.name || 'the group' } will be deleted`,
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
		onPosted() {
			this.isPosting = false;
			EventBus.$once('modified.group', () => {
				this.$nextTick(() => {
					const postListElement = this.$refs.postList.$el;
					scrollTopAnimate(postListElement, postListElement.scrollHeight - postListElement.clientHeight);
				});
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
