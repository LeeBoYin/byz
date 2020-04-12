<template>
	<Modal
		:is-open="isOpen"
		class="modal-share modal--sm"
		@close="$emit('close')"
	>
		<div slot="body" class="user-form">
			<div class="mb-30">
				<div class="frow justify-start row-center mb-25">
					<Avatar
						:name="userName"
						:color="userColor" />
					<ColorSelect v-model="userColor" />
				</div>
				<input
					ref="input"
					type="text"
					v-model="userName"
					v-auto-focus
					:disabled="isLoading"
					placeholder="Your name"
					@keypress.enter="submit"
				>
			</div>
			<div class="frow row-between">
				<a class="hint text-underline" @click="viewAsGuest">view as a guest</a>
				<button class="btn btn--primary" :disabled="isLoading" @click="submit">
					<i v-if="isLoading" class="las la-circle-notch la-spin la"></i>
					<template v-else>
						Join
						<i class="las la-arrow-right"></i>
					</template>
				</button>
			</div>
		</div>

	</Modal>
</template>

<script>
import constants from '@/constants';
import Avatar from '@components/Avatar';
import ColorSelect from '@components/ColorSelect';
import Modal from '@components/Modal';
export default {
	components: {
		Avatar,
		ColorSelect,
		Modal,
	},
	props: ['isOpen'],
	data() {
		return {
			isLoading: false,
			userName: '',
			userColor: _.head(_.shuffle(constants.avatarColors)),
		};
	},
	computed: {
		...mapGetters('board', [
			'boardName',
		]),
	},
	methods: {
		async submit() {
			if(!this.userName.length) {
				this.$refs.input.focus();
				return;
			}
			if(this.isLoading) {
				return;
			}
			this.isLoading = true;
			await this.createUser({
				name: this.userName,
				color: this.userColor,
			});
			this.isLoading = false;
		},
		...mapActions('board', [
			'createUser',
			'viewAsGuest',
		]),
	},
};
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.user-form {
	@extend %board;
}
</style>
