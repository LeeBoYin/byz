<template>
	<TransitionGroup
		:class="`avatar-list--${ size }`"
		class="avatar-list"
		name="avatar-list"
	>
		<div
			v-if="isShowMore"
			:key="'more'"
			class="avatar-list__more"
			v-tooltip="`+${ moreNum }`"
		>
			<i class="las la-ellipsis-h"></i>
		</div>
		<Avatar
			v-for="user in visibleUsers"
			:key="user.id"
			:name="user.name"
			:color="user.color"
			:size="size"
			v-tooltip="user.name"
			class="avatar-list__avatar"
		/>
	</TransitionGroup>
</template>

<script>
import Avatar from '@components/Avatar';
export default {
	components: {
		Avatar,
	},
	props: {
		users: {
			type: [Object, Array],
			default: () => [],
		},
		size: {
			type: String,
			default: 'md',
		},
		max: {
			type: Number,
			default: null,
		},
	},
	computed: {
		moreNum() {
			return this.sortedUsers.length - this.max;
		},
		isShowMore() {
			return this.max && this.sortedUsers.length > this.max;
		},
		sortedUsers() {
			return _.reverse(_.values(this.users));
		},
		visibleUsers() {
			return this.max ? _.take(this.sortedUsers, this.max) : this.sortedUsers;
		},
	},
};
</script>
