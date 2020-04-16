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
			<div class="grow-1 overflow-hidden">
				<div class="frow nowrap items-start">
					<div class="post__content-container grow-1 my-10">
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
					<div v-if="post.posterName" class="post__poster grow-1 shrink-1 overflow-hidden">
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

<style lang="scss">
@import '~@style/custom';
.post {
	position: relative;
	background-color: $c-bright;
	border-radius: $border-r-md;
	box-shadow: 3px 3px 0 rgba(0, 0, 0, .03),
				inset 4px 0 0 #eeeeee;
	display: flex;
	flex-direction: column;
	word-break: break-all;
	transition: background-color .2s ease-out;
	transform-origin: top center;
	&:hover {
		box-shadow: 3px 3px 0 rgba(0, 0, 0, .03),
		inset 4px 0 0 #ffeec0;
	}
	&--red {
		background-color: $c-post-red;
	}
	&--green {
		background-color: $c-post-green;
	}
	&--blue {
		background-color: $c-post-blue;
	}
	&--deleting {
		opacity: 0.5;
		transition: .3s ease-out;
		transform: scale(0);
	}
	&__handle {
		@extend %tool;
		@extend %handle;
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 0 4px;
	}
	&--editing &__handle {
		visibility: hidden;
	}
	&__content {
		font-size: 16px;
		margin: 0;
		flex-grow: 1;
	}
	&__textarea {
		padding: 9px 15px;
		&--saving {
			opacity: 0.6;
		}
	}
	&--white &__textarea, &--red &__textarea, &--green &__textarea, &--blue &__textarea {
		background-color: rgba(255, 255, 255, 0.5);
	}
	&__footer {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		font-size: 0.7rem;
	}
	&__poster {
		@extend %text-ellipsis;
		color: $c-gray;
	}
	&__options {
		@extend %tool;
		font-size: 18px;
		padding: 6px 3px;
	}
	&--editing &__options {
		visibility: hidden;
	}
	&__btn-like {
		display: flex;
		align-items: center;
		i {
			font-size: 16px;
			color: $c-bright;
			opacity: 0.8;
			text-shadow: 0 0 1px $c-dark, 0 0 1px $c-dark, 0 0 1px $c-dark, 0 0 1px $c-dark;
		}
		&--liked {
			i {
				color: $c-danger;
				opacity: 1;
				text-shadow: none;
			}
		}
	}
	&__edited-hint {
		color: $c-gray;
		font-size: 12px;
		display: inline-block;
		margin-left: 5px;
	}
	&__content-container {
		position: relative;
	}
	// guest mode style
	&--guest &__btn-like {
		cursor: default;
	}
	&--guest &__options,
	&--guest &__handle {
		visibility: hidden;
	}
}
.icon-color {
	display: block;
	height: 1em;
	width: 1em;
	border: 1px solid $c-gray-light;
	border-radius: 50%;
	&--white {
		background-color: white;
	}
	&--red {
		background-color: $c-post-red;
	}
	&--green {
		background-color: $c-post-green;
	}
	&--blue {
		background-color: $c-post-blue;
	}
}
</style>
