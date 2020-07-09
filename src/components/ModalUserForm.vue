<template>
	<ModalContent
		:is-open="isOpen"
		size="sm"
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
					v-model.trim="userName"
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
	</ModalContent>
</template>

<script>
import constants from '@/constants';
import Avatar from '@components/Avatar';
import ColorSelect from '@components/ColorSelect';
import ModalContent from '@components/ModalContent';
import { errorShake } from '@libs/uiUtils';
export default {
	components: {
		Avatar,
		ColorSelect,
		ModalContent,
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
			'users',
		]),
	},
	watch: {
		isOpen() {
			if(this.isOpen) {
				this.$nextTick(() => {
					this.$refs.input.focus();
				});
			}
		}
	},
	methods: {
		async submit() {
			if(!this.userName.length) {
				errorShake(this.$refs.input);
				this.$refs.input.focus();
				return;
			}
			if(this.isLoading) {
				return;
			}
			const existingUser = _.find(this.users, (user) => {
				return user.name === this.userName;
			});
			this.isLoading = true;
			if(existingUser) {
				this.setUserId(existingUser.id);
				await this.updateUser({
					userId: existingUser.id,
					updateObj: {
						color: this.userColor,
					},
				});
			} else {
				await this.createUser({
					name: this.userName,
					color: this.userColor,
				});
			}
			this.isLoading = false;
		},
		...mapActions('board', [
			'createUser',
			'setUserId',
			'updateUser',
			'viewAsGuest',
		]),
	},
};
</script>
