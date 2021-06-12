<template>
	<div
		:class="{
			'group--deleting': isDeleting,
			'group--guest': isGuestMode,
			'group--draggable': !isDeleting && !isGuestMode,
			'group--posting': isPosting,
		}"
		class="group layout-u-content-fill-height"
		:data-group-id="group.id"
	>
		<LayoutFlexColumn>
			<template #top>
				<div class="group__header">
					<LayoutFlexRow>
						<template #left>
							<i class="group__handle las la-grip-lines"></i>
						</template>
						<template #remain>
							<EditableTitle
								ref="editableTitle"
								:title="group.name"
								:disabled="isGuestMode"
								:double-clickable="true"
								element="h2"
								placeholder="Group Name"
								align="center"
								class="group__title"
								@update="updateGroupName"
							/>
						</template>
						<template #right>
							<OptionsDropdown :options="options" direction="bottom" class="group__options" />
						</template>
					</LayoutFlexRow>
				</div>
			</template>
			<template #remain>
				<PostList ref="postList" :data-group-id="group.id" :group-id="group.id" :posts="posts" class="group__post-list" />
			</template>
			<template v-if="isPosting" #bottom>
				<div class="group__post-form-area">
					<PostForm
						:group-id="group.id"
						@posted="onPosted"
						@cancel="isPosting = false"
					/>
				</div>
			</template>
		</LayoutFlexColumn>
		<button v-if="!isGuestMode && !isPosting" class="group__btn-post" @click="onClickCreatePost">
			<i class="las la-plus"></i>
		</button>
	</div>
</template>

<script>
// import vueLayoutSystem from 'vue-layout-system';
import EditableTitle from '@components/EditableTitle';
import OptionsDropdown from '@components/OptionsDropdown';
import PostForm from '@components/PostForm';
import PostList from '@components/PostList';
import { scrollTopAnimate, transitionendOnce } from '@libs/uiUtils';
import { EventBus } from '@/main';
import { logEvent } from '@libs/analytics';
export default {
	components: {
		EditableTitle,
		OptionsDropdown,
		PostForm,
		PostList,
		// ...vueLayoutSystem,
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
			const sortedPostIdList = _.map([
				..._.filter(this.posts, post => post.isPinned),
				..._.sortBy(_.filter(this.posts, post => !post.isPinned), (post) => {
					return -_.get(post, 'likedUsersId', []).length;
				})
			], 'id');
			this.updateGroup({
				groupId: this.group.id,
				updateObj: {
					postIdList: sortedPostIdList,
				},
			});
			this.$nextTick(() => {
				logEvent('group_post_list_sorted', {
					group_post_count: this.posts.length,
					group_top_post_like_count: _.get(_.head(this.posts), 'likedUsersId', []).length,
				});
			});
		},
		onPosted() {
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
