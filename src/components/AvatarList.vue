<template>
	<div :class="`avatar-list--${ size }`" class="avatar-list">
		<div v-if="isShowMore" class="avatar-list__more" :title="`+${ moreNum }`">
			<i class="las la-ellipsis-h"></i>
		</div>
		<Avatar
			v-for="user in visibleUsers"
			:key="user.id"
			:name="user.name"
			:color="user.color"
			:title="user.name"
			:size="size"
			class="avatar-list__avatar"
		/>
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

<style lang="scss">
@import '~@style/custom';
$shrink-sm: 6px;
$shrink-md: 10px;
$shrink-lg: 15px;
.avatar-list {
	display: flex;
	flex-direction: row-reverse;
	align-items: center;
	&--sm {
		padding-left: $shrink-sm;
	}
	&--md {
		padding-left: $shrink-md;
	}
	&--lg {
		padding-left: $shrink-lg;
	}
	&__avatar {
		box-sizing: content-box;
		border-style: solid;
	}
}
.avatar {
	&--sm {
		margin-left: -$shrink-sm;
		border-width: 2px;
	}
	&--md {
		margin-left: -$shrink-md;
		border-width: 4px;
	}
	&--lg {
		margin-left: -$shrink-lg;
		border-width: 6px;
	}
}

.menu-bar .avatar-list .avatar {
	border-color: $c-background;
}
.post {
	.avatar-list .avatar {
		border-color: $c-bright;
	}
	&--red .avatar-list .avatar {
		border-color: $c-post-red;
	}
	&--green .avatar-list .avatar {
		border-color: $c-post-green;
	}
	&--blue .avatar-list .avatar {
		border-color: $c-post-blue;
	}
}
</style>
