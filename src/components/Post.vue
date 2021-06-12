<template>
	<div
		:class="[{
			'post--deleting': isDeleting,
			'post--editing': isEditing,
			'post--guest': isGuestMode,
			'post--modal-mode': isModalMode,
			'post--draggable': !isModalMode && !isDeleting && !isEditing && !isGuestMode,
			'post--pinned': post.isPinned,
			},
			colorClass
		]"
		class="post"
		:data-post-id="post.id"
		@click="enterModalMode"
		@mousedown="mousedownPosition = { x: $event.x, y: $event.y }"
		@mouseup="mouseupPosition = { x: $event.x, y: $event.y }"
	>
		<LayoutFlexRow>
			<template #left>
				<div v-if="post.isPinned" class="post__pin">
					<i class="las la-thumbtack"></i>
				</div>
				<div v-else class="post__handle layout-u-content-fill-height" @click.stop>
					<LayoutAlign vertical-align="center">
						<i class="las la-grip-lines-vertical"></i>
					</LayoutAlign>
				</div>
			</template>
			<template #remain>
				<LayoutFlexRow vertical-align="top">
					<template #remain>
						<div class="layout-u-position-relative layout-u-mt-2">
							<div v-if="!isEditing" class="post__content" v-html="formattedContent" @click="onClickContent"></div>
							<textarea
								v-if="isEditing"
								v-model.trim="editedContent"
								ref="textarea"
								:class="{ 'post__textarea--saving': isSaving }"
								class="post__textarea"
								rows="1"
								v-auto-focus
								v-auto-height
								:disabled="isSaving"
								@keypress.enter="onEditPressEnter"
								@keydown.prevent.stop.esc="cancelEdit"
							></textarea>
							<LayoutAbsolute v-if="isSaving">
								<template #center>
									<i class="las la-circle-notch la-spin la"></i>
								</template>
							</LayoutAbsolute>
						</div>
					</template>
					<template #right>
						<OptionsDropdown :options="options" direction="left" class="post__options" />
					</template>
				</LayoutFlexRow>
				<div class="post__footer">
					<LayoutFlexRow vertical-align="bottom" padding="2 2 2 0">
						<template #remain>
							<LayoutList gap="1" horizontal-align="left">
								<div v-if="post.posterName" class="post__poster">
									- {{ post.posterName }}
								</div>
								<div v-if="isModalMode" class="post__post-time">
								<span v-tooltip="postTimeCalendar">
									{{ postTimeAgo }}
								</span>
								</div>
								<div v-if="!isModalMode && post.commentCount" class="post__comment-count">
									{{`${ post.commentCount } comment${ post.commentCount > 1 ? 's' : '' }` }}
								</div>
							</LayoutList>
						</template>
						<template #right>
							<LayoutListInline vertical-align="center" gap="2">
								<AvatarList
									:users="likedUsers"
									:max="10"
									size="sm"
								/>
								<button
									v-if="!isGuestMode"
									ref="btnLike"
									:class="{ 'post__btn-like--liked': isLikedByCurrentUser }"
									class="post__btn-like"
									@click.stop="toggleLike">
									<i class="las la-heart"></i>
								</button>
							</LayoutListInline>
						</template>
					</LayoutFlexRow>
				</div>
			</template>
		</LayoutFlexRow>
		<PostCommentArea
			ref="commentArea"
			:post-id="this.post.id"
		/>
	</div>
</template>

<script>
import { animationOnce, transitionendOnce, Flip } from '@libs/uiUtils';
import editablePostContentMixin from '@/mixins/editablePostContent';
import AvatarList from '@components/AvatarList';
import OptionsDropdown from '@components/OptionsDropdown';
import PostCommentArea from '@components/PostCommentArea';
import constants from '@/constants';
import { showDownConverter } from '@/main';

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
	mixins: [
		editablePostContentMixin,
	],
	props: {
		post: Object,
	},
	data() {
		return {
			isDeleting: false,
			isModalMode: false,
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
			return showDownConverter.makeHtml(this.post.content);
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
					onClick: () => {
						this.onClickEdit(this.post.content);
					},
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
					title: 'Pin',
					iconClass: 'icon-pin las la-thumbtack',
					onClick: this.onClickPin,
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
	beforeDestroy() {
		document.removeEventListener('keydown', this.onKeyDown);
	},
	methods: {
		bindEvents() {
			// bind leaveModalMode
			overlay.addEventListener('click', this.leaveModalMode);
			document.addEventListener('keydown', this.onKeyDown);
			setInterval(() => {
				this.lastUpdateTimestamp = moment();
			}, 3000);
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
				// avoid modal mode when click on <a> links
				e.stopPropagation();
			}
			if(e.target.matches('img')) {
				if(this.isModalMode) {
					window.open(e.target.src, '_blank');
				}
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
		async onClickPin() {
			await this.togglePostPin(this.post.id);
		},
		onKeyDown(e) {
			if(e.key === 'Escape') {
				this.leaveModalMode();
			}
		},
		async save() {
			await this.updatePost({
				postId: this.post.id,
				updateObj: {
					content: this.editedContent,
					lastEditTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
				},
			});
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
			'togglePostPin',
		]),
	},
};
</script>
