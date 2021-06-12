<template>
	<div :class="{ 'post-comment--editing': isEditing }" class="post-comment">
		<LayoutAlign :horizontal-align="isEditing ? 'default' : 'left'">
			<LayoutFlexRow vertical-align="top">
				<template #left>
					<Avatar
						v-tooltip="poster.name"
						:name="poster.name"
						:color="poster.color"
						size="md"
						class="layout-u-mr-2"
					/>
				</template>
				<template #remain>
					<div class="layout-u-position-relative">
						<div v-if="!isEditing" class="post-comment__content" @click="onClickContent">
							<LayoutList gap="1" horizontal-align="left">
								<div v-html="formattedContent"></div>
								<div class="post-comment__post-time">
									<span v-tooltip="postTimeCalendar">
										{{ postTimeAgo }}
									</span>
								</div>
							</LayoutList>
						</div>
						<textarea
							v-if="isEditing"
							v-model.trim="editedContent"
							ref="textarea"
							:class="{ 'post-comment__textarea--saving': isSaving }"
							class="post-comment__textarea"
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
					<OptionsDropdown v-if="!isGuestMode && !isEditing" :options="options" direction="left" class="post-comment__options" />
				</template>
			</LayoutFlexRow>
		</LayoutAlign>
	</div>
</template>

<script>
import Avatar from '@components/Avatar';
import OptionsDropdown from '@components/OptionsDropdown';
import constants from '@/constants';
import editablePostContentMixin from '@/mixins/editablePostContent';
import { showDownConverter } from '@/main';

export default {
	components: {
		Avatar,
		OptionsDropdown,
	},
	mixins: [
		editablePostContentMixin,
	],
	props: {
		comment: Object,
	},
	data() {
		return {
			isEditing: false,
			lastUpdateTimestamp: moment(),
			options: [
				{
					title: 'Edit',
					iconClass: 'las la-pencil-alt',
					onClick: () => {
						this.onClickEdit(this.comment.content);
					},
				},
				{
					title: 'Delete comment',
					iconClass: 'las la-trash-alt',
					onClick: this.onClickDelete,
					isDanger: true,
				},
			],
		};
	},
	mounted() {
		setInterval(() => {
			this.lastUpdateTimestamp = moment();
		}, 3000);
	},
	computed: {
		formattedContent() {
			return showDownConverter.makeHtml(this.comment.content);
		},
		poster() {
			return this.getUserById(this.comment.posterId) || {};
		},
		postTimeAgo() {
			if(!this.comment.timestamp) {
				return 'posting';
			}
			return this.lastUpdateTimestamp && moment(this.comment.timestamp.toDate()).fromNow();
		},
		postTimeCalendar() {
			if(!this.comment.timestamp) {
				return null;
			}
			return this.lastUpdateTimestamp && moment(this.comment.timestamp.toDate()).calendar(null, {
				sameElse: constants.dateFormat,
			});
		},
		...mapState('board', [
			'isGuestMode',
		]),
		...mapGetters('board', [
			'getUserById',
		]),
	},
	methods: {
		async save() {
			await this.updateComment({
				commentId: this.comment.id,
				updateObj: {
					content: this.editedContent,
					lastEditTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
				},
			});
		},
		onClickDelete() {
			this.deleteComment(this.comment.id);
		},
		onClickContent(e) {
			if(e.target.matches('img')) {
				window.open(e.target.src, '_blank');
			}
		},
		...mapActions('board', [
			'deleteComment',
			'updateComment',
		]),
	},
};
</script>
