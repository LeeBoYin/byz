<template>
	<div class="avatar-list">
		<Avatar
			v-for="user in sortedUsers"
			:key="user.id"
			:name="user.name"
			:color="user.color"
			:title="user.name"
			class="avatar-list__avatar"
			size="sm"
		/>
	</div>
</template>

<script>
import Avatar from '@components/Avatar';
export default {
	components: {
		Avatar,
	},
	computed: {
		sortedUsers() {
			return _.reverse(_.clone(this.users));
		},
		...mapGetters('board', [
			'users',
		]),
	},
};
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.avatar-list {
	display: flex;
	flex-direction: row-reverse;
	&__avatar {
		margin-left: -10px;
		box-sizing: content-box;
		border: 4px solid $c-background;
	}
}
</style>
