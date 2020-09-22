<template>
	<div class="frow centered-column">
		<Card>
			<div class="frow direction-column mb-30">
				<label class="mb-15">Board Name</label>
				<input
					ref="input"
					v-model="boardName"
					v-auto-focus
					type="text"
					class="input-block"
					:disabled="isLoading"
					placeholder="Board name"
					@keypress.enter="submit"
				>
			</div>
			<div class="text-right">
				<button class="btn btn--primary" :disabled="isLoading" @click="submit">
					<i v-if="isLoading" class="las la-circle-notch la-spin la"></i>
					<template v-else>
						Create
						<i class="las la-arrow-right"></i>
					</template>
				</button>
			</div>
		</Card>
	</div>
</template>

<script>
import Card from '@components/Card';
import { errorShake } from '@libs/uiUtils';
export default {
	components: {
		Card,
	},
	data() {
		return {
			boardName: '',
			isLoading: false,
		};
	},
	methods: {
		async submit() {
			if(_.isEmpty(this.boardName)) {
				errorShake(this.$refs.input);
				this.$refs.input.focus();
				return;
			}
			this.isLoading = true;
			const docRef = await this.createBoard({
				boardName: this.boardName,
			});
			await this.$router.push( {
				name: 'Board',
				params: {
					id: docRef.id,
					action: 'join',
				},
			} );
		},
		...mapActions('create', [
			'createBoard',
		]),
	},
};
</script>
