<template>
	<div
		:class="[{
			'post--deleting': isDeleting,
			'post--editing': isEditing,
			'post--guest': isGuestMode,
			'post--modal-mode': isModalMode,
			},
			colorClass
		]"
		class="post"
		:data-post-id="post.id"
		@click="enterModalMode"
		@mousedown="mousedownPosition = { x: $event.x, y: $event.y }"
		@mouseup="mouseupPosition = { x: $event.x, y: $event.y }"
	>
		<div class="frow nowrap">
			<i class="post__handle las la-grip-lines-vertical" @click.stop></i>
			<div class="grow-remain">
				<div class="frow nowrap items-start">
					<div class="post__content-container grow-remain mt-10">
						<p v-if="!isEditing" class="post__content" @click="onClickContent">
							<span v-html="formattedContent"></span>
						</p>
						<textarea
							v-if="isEditing"
							v-model.trim="editedContent"
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
					<div class="grow-remain">
						<div v-if="post.posterName" class="post__poster">
							- {{ post.posterName }}
						</div>
						<div v-if="isModalMode" class="post__post-time">
							<span v-tooltip="postTimeCalendar">
								{{ postTimeAgo }}
							</span>
						</div>
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
							@click.stop="toggleLike">
							<i class="las la-heart"></i>
						</button>
					</div>
				</div>
			</div>
		</div>
		<PostCommentArea
			ref="commentArea"
			:post-id="this.post.id"
		/>
	</div>
</template>

<script>
import showdown from 'showdown';
import { animationOnce, transitionendOnce, Flip } from '@libs/uiUtils';
import AvatarList from '@components/AvatarList';
import OptionsDropdown from '@components/OptionsDropdown';
import PostCommentArea from '@components/PostCommentArea';
import constants from '@/constants';
const converter = new showdown.Converter({
	simplifiedAutoLink: true,
});
// create overlay
const overlay = document.createElement('div');
overlay.classList.add('post-modal-overlay');
document.querySelector('body').appendChild(overlay);
let ghostNode = null;

export default {
	components: {
		AvatarList,
		OptionsDropdown,
		PostCommentArea,
	},
	props: {
		post: Object,
	},
	data() {
		return {
			editedContent: null,
			isDeleting: false,
			isEditing: false,
			isModalMode: false,
			isSaving: false,
			lastUpdateTimestamp: moment(),
			mousedownPosition: null,
			mouseupPosition: null,
		};
	},
	computed: {
		colorClass() {
			const color = _.get(this.post, 'color', null);
			if(!color) {
				return null;
			}
			return `post--colored post--${ color }`;
		},
		formattedContent() {
			return converter.makeHtml(this.post.content);
		},
		hasMouseMoved() {
			return Math.abs(this.mouseupPosition.x - this.mousedownPosition.x) > 3 ||
				Math.abs(this.mouseupPosition.y - this.mousedownPosition.y) > 3;
		},
		isLikedByCurrentUser() {
			return _.includes(this.post.likedUsersId, _.get(this.currentUser, 'id'));
		},
		likedUsers() {
			return this.getUsersById(this.post.likedUsersId);
		},
		options() {
			return [
				{
					title: 'Edit',
					iconClass: 'las la-pencil-alt',
					onClick: this.onClickEdit,
				},
				{
					title: 'White',
					iconClass: 'icon-color icon-color--white',
					onClick: this.onClickColor(null),
				},
				{
					title: 'Red',
					iconClass: 'icon-color icon-color--red',
					onClick: this.onClickColor('red'),
				},
				{
					title: 'Green',
					iconClass: 'icon-color icon-color--green',
					onClick: this.onClickColor('green'),
				},
				{
					title: 'Blue',
					iconClass: 'icon-color icon-color--blue',
					onClick: this.onClickColor('blue'),
				},
				{
					title: 'Delete',
					iconClass: 'las la-trash-alt',
					onClick: this.onClickDelete,
					isDanger: true,
				},
			];
		},
		postTimeAgo() {
			if(!this.post.timestamp) {
				return 'posting';
			}
			return this.lastUpdateTimestamp && moment(this.post.timestamp.toDate()).fromNow();
		},
		postTimeCalendar() {
			if(!this.post.timestamp) {
				return null;
			}
			return this.lastUpdateTimestamp && moment(this.post.timestamp.toDate()).calendar(null, {
				sameElse: constants.dateFormat,
			});
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
	mounted() {
		this.bindEvents();
	},
	methods: {
		bindEvents() {
			// bind leaveModalMode
			overlay.addEventListener('click', this.leaveModalMode);
			document.addEventListener('keydown', (e) => {
				if(e.key === 'Escape') {
					this.leaveModalMode();
				}
			});
			setInterval(() => {
				this.lastUpdateTimestamp = moment();
			}, 3000);
		},
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
		onClickContent(e) {
			if(e.target.matches('a')) {
				e.preventDefault();
				e.stopPropagation();
				window.open(e.target.href);
			}
		},
		async onClickDelete() {
			if(this.isModalMode) {
				await this.leaveModalMode();
				await new Promise(resolve => setTimeout(resolve, 0)); // wait transitionend propagation
			}
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
		enterModalMode() {
			return new Promise((resolve, reject) => {
				if(this.isModalMode) {
					return resolve();
				}
				if(this.isEditing) {
					return reject();
				}
				if(this.hasMouseMoved) {
					return reject();
				}

				const el = this.$el;
				const flip = new Flip(el, {
					transitionClass: 'post--on-transition',
				});
				this.isModalMode = true;
				// clone a placeholder
				ghostNode = el.cloneNode( true );
				ghostNode.classList.add('post--ghost');
				el.after( ghostNode );

				// first
				flip.first();

				// last
				el.classList.add('post--modal-mode');
				el.style.left = `calc(50% - ${ el.offsetWidth / 2 }px)`;
				flip.last();

				// invert
				flip.invert();

				// play
				overlay.classList.add('post-modal-overlay--show');
				this.$refs.commentArea.expand();
				flip.play().then(() => {
					resolve();
				});
			}).catch(() => {
				// do nothing
			});
		},
		leaveModalMode() {
			return new Promise((resolve) => {
				if(!this.isModalMode) {
					return resolve();
				}
				this.isModalMode = false;
				const el = this.$el;
				const flip = new Flip(el, {
					transitionClass: 'post--on-transition',
				});

				// first
				const first = flip.first();

				// before last
				el.classList.remove('post--modal-mode');
				el.style.maxHeight = first.height; // prevent last.height exceed first.height
				ghostNode.style.display = 'none';

				// last
				const last = flip.last();

				// before invert
				ghostNode.style.display = '';
				el.style.maxHeight = first.height;
				el.style.top = last.y;
				el.style.left = last.x;
				el.style.width = last.width;

				// invert
				flip.invert();

				// play
				overlay.classList.remove('post-modal-overlay--show');
				this.$refs.commentArea.collapse();
				flip.play().then(() => {
					ghostNode.remove();
					el.style.maxHeight = '';
					el.style.top = '';
					el.style.left = '';
					el.style.width = '';
					resolve();
				});
			});
		},
		...mapActions('board', [
			'deletePost',
			'updatePost',
		]),
	},
};
</script>
