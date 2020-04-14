<template>
	<div :class="{ 'group-form--loading': isLoading }" class="group-form">
		<div class="frow nowrap">
			<EditableTitle
				:title="groupName"
				:disabled="isLoading"
				element="h2"
				class="group-form__title grow-1"
				placeholder="Group Name"
				@cancel="cancel"
				@update="save"
			/>
			<button
				class="pl-10"
				:disabled="isLoading"
				@click="cancel"
			>
				<i class="las la-times"></i>
			</button>
		</div>
		<div v-if="isLoading" class="absolute-center">
			<i class="absolute-center las la-circle-notch la-spin la"></i>
		</div>
	</div>
</template>

<script>
import EditableTitle from '@components/EditableTitle';
export default {
	components: {
		EditableTitle,
	},
	data() {
		return {
			groupName: '',
			isLoading: false,
		};
	},
	methods: {
		async save(groupName) {
			this.groupName = groupName;
			this.isLoading = true;
			await this.createGroup({
				name: this.groupName,
			});
			this.$emit('created');
			this.isLoading = false;
		},
		cancel() {
			this.$emit('cancel');
		},
		...mapActions('board', [
			'createGroup',
		]),
	},
};
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.group-form {
	position: relative;
	background-color: rgba(0, 0, 0, 0.02);
	padding: 0 24px;
	border-radius: $border-r-md;
	width: $w-group;
	&--loading {
		opacity: 0.8;
	}
	&__title {
		padding: 16px 0;
		overflow: hidden;
	}
}
</style>
