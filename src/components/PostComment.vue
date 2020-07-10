<template>
	<div :class="{ 'post-comment--editing': isEditing }" class="post-comment">
		<div class="frow justify-start nowrap">
			<Avatar
				v-tooltip="poster.name"
				:name="poster.name"
				:color="poster.color"
				size="md"
				class="post-comment__avatar"
			/>
			<div :class="{ 'grow-remain': isEditing }" class="post-comment__content-container">
				<div v-if="!isEditing" class="post-comment__content">
					<span v-html="formattedContent"></span>
					<div class="post-comment__post-time">
						<span v-tooltip="postTimeCalendar">
							{{ postTimeAgo }}
						</span>
					</div>
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
				<div v-if="isSaving" class="absolute-center">
					<i class="las la-circle-notch la-spin la"></i>
				</div>
			</div>
			<OptionsDropdown v-if="!isEditing" :options="options" direction="left" class="post-comment__options" />
		</div>
	</div>
</template>

<script>
import showdown from 'showdown';
import Avatar from '@components/Avatar';
import OptionsDropdown from '@components/OptionsDropdown';
import constants from '@/constants';
import editablePostContentMixin from '@/mixins/editablePostContent';
const converter = new showdown.Converter({
	simplifiedAutoLink: true,
});
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
			return converter.makeHtml(this.comment.content);
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
		...mapActions('board', [
			'deleteComment',
			'updateComment',
		]),
	},
};
</script>
