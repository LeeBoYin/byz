<template>
	<div>
		<h1>Create a user</h1>
		<input type="text" v-model="userName" @keypress.enter="submit">
		<a class="btn" :disabled="!userName.length" @click="submit">join</a>
	</div>
</template>

<script>
export default {
	data() {
		return {
			userName: '',
		};
	},
	methods: {
		submit() {
			if(!this.userName.length) {
				return;
			}
			this.createUser({
				name: this.userName,
			});
		},
		...mapActions('board', [
			'createUser'
		]),
	},
};
</script>

<style scoped>

</style>