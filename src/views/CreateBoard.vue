<template>
	<div class="frow centered-column">
		<h1 class="mb-25">Create a Board</h1>
		<input ref="input" v-model="boardName" type="text" class="mb-20" :disabled="isLoading" placeholder="Board name" @keypress.enter="submit">
		<button class="btn" :disabled="isLoading" @click="submit">
			<i v-if="isLoading" class="las la-circle-notch la-spin la"></i>
			<template v-else>
				Create
			</template>
		</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			boardName: '',
			isLoading: false,
		};
	},
	mounted() {
		this.$refs.input.focus();
	},
	methods: {
		async submit() {
			if(_.isEmpty(this.boardName)) {
				this.$refs.input.focus();
				return;
			}
			this.isLoading = true;
			const docRef = await this.createBoard({
				boardName: this.boardName,
			});
			this.$router.push(`board/${ docRef.id }`);
		},
		...mapActions('create', [
			'createBoard',
		]),
	},
};
</script>

<style lang="scss" scoped>
	input, button {
		width: 300px;
	}
</style>
