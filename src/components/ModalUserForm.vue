<template>
	<Modal
		:is-open="isOpen"
		class="modal-share modal--sm"
		@close="$emit('close')"
	>
		<div slot="body" class="user-form">
			<div class="mb-30">
				<label class="mb-15">Create an user to join {{ boardName }}</label>
				<input
					ref="input"
					type="text"
					v-model="userName"
					:disabled="isLoading"
					placeholder="Your name"
					@keypress.enter="submit"
				>
			</div>
			<div class="text-right">
				<button class="btn btn--primary" :disabled="isLoading" @click="submit">
					<i v-if="isLoading" class="las la-circle-notch la-spin la"></i>
					<template v-else>
						Join
					</template>
				</button>
			</div>
		</div>

	</Modal>
</template>

<script>
import Modal from '@components/Modal';
export default {
	components: {
		Modal,
	},
	props: ['isOpen'],
	data() {
		return {
			isLoading: false,
			userName: '',
		};
	},
	computed: {
		...mapGetters('board', [
			'boardName',
		]),
	},
	mounted() {
		this.$refs.input.focus();
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
			});
			this.isLoading = false;
		},
		...mapActions('board', [
			'createUser'
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
