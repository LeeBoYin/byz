<template>
	<div
		:class="`avatar-list--${ size }`"
		class="avatar-list"
	>
		<TransitionGroup
			class="avatar-list__list"
			name="avatar-list"
		>
			<Avatar
				v-for="user in _.reverse(visibleUsers)"
				:key="user.id"
				:name="user.name"
				:color="user.color"
				:size="size"
				:inactive="user.inactive"
				v-tooltip="user.name"
				class="avatar-list__avatar"
			/>
		</TransitionGroup>
		<div
			v-if="isShowMore"
			:key="`more-${ moreNum }`"
			v-tooltip="`+${ moreNum }`"
			class="avatar-list__more"
		>
			<i class="las la-ellipsis-h"></i>
		</div>
	</div>
</template>

<script>
import Avatar from '@components/Avatar';
export default {
	components: {
		Avatar,
	},
	props: {
		users: {
			type: Array,
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
			return this.users.length - this.max;
		},
		isShowMore() {
			return this.max && this.users.length > this.max;
		},
		visibleUsers() {
			return this.max ? _.take(this.users, this.max) : this.users;
		},
	},
};
</script>
