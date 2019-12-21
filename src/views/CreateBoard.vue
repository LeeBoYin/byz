<template>
	<div>
		<h1>Create a Board</h1>
		<div>
			Board Name:
			<input v-model="boardName" type="text">
		</div>
		<div>
			Your Name:
			<input v-model="userName" type="text">
		</div>
		<button @click="onClickCreate">Create</button>
	</div>
</template>

<script>
export default {
	name: 'CreateBoard.vue',
	data() {
		return {
			boardName: '',
			userName: '',
		};
	},
	methods: {
		async onClickCreate() {
			if(_.isEmpty(this.boardName )|| _.isEmpty(this.userName)) {
				return;
			}
			const docRef = await this.createBoard({
				boardName: this.boardName,
				userName: this.userName,
			});
			this.$router.push(`board/${ docRef.id }`);
		},
		...mapActions('create', [
			'createBoard',
		]),
	},
}
</script>

<style scoped>

</style>