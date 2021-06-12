<template>
	<ModalContent
		:is-open="isOpen"
		size="sm"
		@close="$emit('close')"
	>
		<div slot="body" class="user-form">
			<LayoutList gap="5" padding-x="8" padding-y="6">
				<LayoutListInline gap="4" vertical-align="center">
					<Avatar
						:name="userName"
						:color="userColor" />
					<ColorSelect v-model="userColor" />
				</LayoutListInline>
				<AutocompleteInput
					ref="autocompleteInput"
					v-model="userName"
					type="text"
					class="user-form__autocomplete-input"
					:options="usersOptions"
					:auto-focus="true"
					:disabled="isLoading"
					placeholder="Your name"
					@keypress.enter="submit"
				/>
				<LayoutFlexRow vertical-align="center">
					<template #left>
						<a class="hint link" @click="viewAsGuest">view as a guest</a>
					</template>
					<template #right>
						<button class="btn btn--primary" :disabled="isLoading" @click="submit">
							<i v-if="isLoading" class="las la-circle-notch la-spin la"></i>
							<template v-else>
								{{ isNameExisting ? 'ENTER' : 'JOIN' }}
								<i class="las la-arrow-right"></i>
							</template>
						</button>
					</template>
				</LayoutFlexRow>
			</LayoutList>
		</div>
	</ModalContent>
</template>

<script>
import constants from '@/constants';
import AutocompleteInput from '@components/AutocompleteInput';
import Avatar from '@components/Avatar';
import ColorSelect from '@components/ColorSelect';
import ModalContent from '@components/ModalContent';
import { errorShake } from '@libs/uiUtils';
import { logEvent } from '@libs/analytics';
export default {
	components: {
		AutocompleteInput,
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
		isNameExisting() {
			return _.some(this.users, user => {
				return user.name === this.userName;
			});
		},
		usersOptions() {
			return _.map(this.users, user => {
				return {
					text: user.name,
					color: user.color,
				};
			});
		},
		...mapGetters('board', [
			'boardName',
			'users',
		]),
	},
	watch: {
		isOpen() {
			if(this.isOpen) {
				this.$nextTick(() => {
					this.$refs.autocompleteInput.focus();
				});
			}
		},
		userName() {
			const existingUser = _.find(this.users, user => {
				return user.name === this.userName;
			});
			if(existingUser) {
				this.userColor = existingUser.color;
			}
		},
	},
	methods: {
		async submit() {
			this.userName = _.trim(this.userName);
			if(!this.userName.length) {
				errorShake(this.$refs.autocompleteInput.$el);
				this.$refs.autocompleteInput.focus();
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
			logEvent('user_joined', {
				is_existing_user: !!existingUser,
			});
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
