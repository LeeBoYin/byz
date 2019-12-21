<template>
	<div>
		<h1>Create a Board</h1>
		<div>
			Board Name:
			<input v-model="boardName" type="text" @keypress.enter="submit">
		</div>
		<a class="btn" @click="submit">Create</a>
	</div>
</template>

<script>
export default {
	data() {
		return {
			boardName: '',
		};
	},
	methods: {
		async submit() {
			if(_.isEmpty(this.boardName )) {
				return;
			}
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

<style scoped>

</style>