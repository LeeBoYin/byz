<template>
	<div class="post-comment">
		<div class="frow justify-start nowrap">
			<Avatar
				v-tooltip="poster.name"
				:name="poster.name"
				:color="poster.color"
				size="md"
				class="post-comment__avatar"
			/>
			<div class="post-comment__content">
				<span v-html="formattedContent"></span>
				<div class="post-comment__post-time">
					<span v-tooltip="postTimeCalendar">
						{{ postTimeAgo }}
					</span>
				</div>
			</div>
			<OptionsDropdown :options="options" direction="left" class="post-comment__options" />
		</div>
	</div>
</template>

<script>
import showdown from 'showdown';
import Avatar from '@components/Avatar';
import OptionsDropdown from '@components/OptionsDropdown';
import constants from '@/constants';
const converter = new showdown.Converter({
	simplifiedAutoLink: true,
});
export default {
	components: {
		Avatar,
		OptionsDropdown,
	},
	props: {
		comment: Object,
	},
	data() {
		return {
			lastUpdateTimestamp: moment(),
			options: [
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
			const lineBroke = _.replace(this.comment.content, /\n/g, '<br>');
			return converter.makeHtml(lineBroke);
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
		onClickDelete() {
			this.deleteComment(this.comment.id);
		},
		...mapActions('board', [
			'deleteComment',
		]),
	},
};
</script>
