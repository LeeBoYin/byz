<template>
	<div class="frow centered-column">
		<div class="board-create">
			<div class="mb-30">
				<label class="mb-15">Board Name</label>
				<input
					ref="input"
					v-model="boardName"
					v-auto-focus
					type="text"
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
		</div>

	</div>
</template>

<script>
import { errorShake } from '@libs/uiUtils';
export default {
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
				},
			} );
		},
		...mapActions('create', [
			'createBoard',
		]),
	},
};
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.board-create {
	@extend %board;
	@extend %board--float;
	width: 100%;
	max-width: $block-md;
}
</style>
