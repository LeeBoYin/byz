<template>
	<div class="frow centered-column">
		<h1 class="mb-5">Create an User</h1>
		<div class="mb-25">to join {{ boardName }}</div>
		<input ref="input" type="text" v-model="userName" class="mb-20" :disabled="isLoading" placeholder="Your name" @keypress.enter="submit">
		<button class="btn" :disabled="isLoading" @click="submit">
			<i v-if="isLoading" class="las la-circle-notch la-spin la"></i>
			<template v-else>
				Join
			</template>
		</button>
	</div>
</template>

<script>
export default {
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
	input, button {
		width: 300px;
	}
</style>
