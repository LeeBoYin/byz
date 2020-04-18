<template>
	<div
		:class="[{
			'post--editing': isEditing,
			'post--deleting': isDeleting,
			'post--guest': isGuestMode
			},
			colorClass
		]"
		class="post"
		:data-post-id="post.id"
	>
		<div class="frow nowrap">
			<i class="post__handle las la-grip-lines-vertical"></i>
			<div class="grow-remain">
				<div class="frow nowrap items-start">
					<div class="post__content-container grow-remain my-10">
						<p v-if="!isEditing" class="post__content">
							<span v-html="formattedContent"></span>
						</p>
						<textarea
							v-if="isEditing"
							v-model="editedContent"
							:class="{ 'post__textarea--saving': isSaving }"
							class="post__textarea"
							rows="1"
							v-auto-focus
							v-auto-height
							:disabled="isSaving"
							@keypress.enter="save"
							@keydown.prevent.stop.esc="cancelEdit"
						></textarea>
						<div v-if="isSaving" class="absolute-center">
							<i class="las la-circle-notch la-spin la"></i>
						</div>
					</div>
					<OptionsDropdown :options="options" direction="left" class="post__options" />
				</div>
				<div class="post__footer my-10 mr-10">
					<div v-if="post.posterName" class="post__poster grow-remain">
						- {{ post.posterName }}
					</div>
					<div class="frow row-center shrink-0">
						<AvatarList
							:users="likedUsers"
							:max="10"
							size="sm"
						/>
						<button
							v-if="!isGuestMode"
							ref="btnLike"
							:class="{ 'post__btn-like--liked': isLikedByCurrentUser }"
							class="post__btn-like shrink-0 ml-10"
							@click="toggleLike">
							<i class="las la-heart"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import setStringToClipBoard from 'set-string-to-clipboard';
import showdown from 'showdown';
import { animationOnce, transitionendOnce } from '@libs/uiUtils';
import AvatarList from '@components/AvatarList';
import OptionsDropdown from '@components/OptionsDropdown';
const converter = new showdown.Converter({
	simplifiedAutoLink: true,
});
export default {
	components: {
		AvatarList,
		OptionsDropdown,
	},
	props: {
		post: Object,
	},
	data() {
		return {
			editedContent: null,
			isDeleting: false,
			isEditing: false,
			isSaving: false,
		};
	},
	computed: {
		colorClass() {
			const color = _.get(this.post, 'color', null);
			if(!color) {
				return null;
			}
			return `post--${ color }`;
		},
		formattedContent() {
			return converter.makeHtml(this.post.content);
		},
		isLikedByCurrentUser() {
			return _.includes(this.post.likedUsersId, _.get(this.currentUser, 'id'));
		},
		likedUsers() {
			return this.getUsersById(this.post.likedUsersId);
		},
		options() {
			const options = [
				{
					title: 'Edit',
					iconClass: 'las la-pencil-alt',
					onClick: this.onClickEdit,
					isShow: true,
				},
				{
					title: 'White',
					iconClass: 'icon-color icon-color--white',
					onClick: this.onClickColor(null),
					isShow: true,
				},
				{
					title: 'Red',
					iconClass: 'icon-color icon-color--red',
					onClick: this.onClickColor('red'),
					isShow: true,
				},
				{
					title: 'Green',
					iconClass: 'icon-color icon-color--green',
					onClick: this.onClickColor('green'),
					isShow: true,
				},
				{
					title: 'Blue',
					iconClass: 'icon-color icon-color--blue',
					onClick: this.onClickColor('blue'),
					isShow: true,
				},
				{
					title: 'Delete',
					iconClass: 'las la-trash-alt',
					onClick: this.onClickDelete,
					isDanger: true,
					isShow: true,
				},
			];
			return _.filter(options, 'isShow');
		},
		...mapState('board', [
			'isGuestMode',
		]),
		...mapGetters('board', [
			'currentUser',
			'getUsersById',
			'users',
		]),
	},
	watch: {
		isLikedByCurrentUser() {
			if(this.isLikedByCurrentUser) {
				animationOnce(this.$refs.btnLike, 'heart-beat', 0.2);
			}
		},
	},
	methods: {
		cancelEdit() {
			this.isEditing = false;
		},
		onClickColor(color) {
			return () => {
				this.updatePost({
					postId: this.post.id,
					updateObj: {
						color: color,
					}
				});
			};
		},
		onClickCopy() {
			setStringToClipBoard(this.post.content);
		},
		onClickDelete() {
			transitionendOnce(this.$el, () => {
				this.deletePost(this.post.id);
			});
			this.isDeleting = true;
			this.$nextTick(() => {
				this.$el.style.marginBottom = `-${ this.$el.offsetHeight }px`;
			});
		},
		onClickEdit() {
			this.editedContent = this.post.content;
			this.isEditing = true;
		},
		async save(e) {
			if(e.ctrlKey || e.shiftKey || e.altKey) {
				// 換行
				return;
			}
			e.preventDefault();
			if(this.post.content === this.editedContent) {
				this.isEditing = false;
				return;
			}
			this.isSaving = true;
			await this.updatePost({
				postId: this.post.id,
				updateObj: {
					content: this.editedContent,
					lastEditTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
				},
			});
			this.isSaving = false;
			this.isEditing = false;
		},
		toggleLike() {
			if(this.isGuestMode) {
				return;
			}
			this.updatePost({
				postId: this.post.id,
				updateObj: {
					likedUsersId: this.isLikedByCurrentUser
						? firebase.firestore.FieldValue.arrayRemove(this.currentUser.id)
						: firebase.firestore.FieldValue.arrayUnion(this.currentUser.id),
				},
			});
		},
		...mapActions('board', [
			'deletePost',
			'updatePost',
		]),
	},
};
</script>
