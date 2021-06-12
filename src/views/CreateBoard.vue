<template>
	<LayoutAlign vertical-align="center">
		<Card>
			<LayoutList gap="6">
				<LayoutList gap="3">
					<label>Board Name</label>
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
				</LayoutList>
				<LayoutAlign horizontal-align="right">
					<button class="btn btn--primary" :disabled="isLoading" @click="submit">
						<i v-if="isLoading" class="las la-circle-notch la-spin la"></i>
						<template v-else>
							Create
							<i class="las la-arrow-right"></i>
						</template>
					</button>
				</LayoutAlign>
			</LayoutList>
		</Card>
	</LayoutAlign>
</template>

<script>
import createStore from '@store/create';
import Card from '@components/Card';
import { errorShake } from '@libs/uiUtils';
import { logEvent } from '@libs/analytics';
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
	beforeCreate() {
		this.$store.registerModule('create', createStore);
	},
	mounted() {
		logEvent('create_form_loaded');
	},
	destroyed() {
		this.$store.unregisterModule('create');
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
			logEvent('board_created', {
				board_id: docRef.id,
			});
		},
		...mapActions('create', [
			'createBoard',
		]),
	},
};
</script>
