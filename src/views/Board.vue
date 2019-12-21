<template>
	<div>
		<h1>Board!</h1>
		<div>board ID: {{ id }}</div>
		<div>board name: {{ boardName }}</div>
		<hr>
		<div>
			<h1>Set board name</h1>
			<input type="text" v-model="newName">
			<button :disabled="!newName.length" @click="renameBoard(newName)">rename</button>
		</div>
		<hr>
		<FormPost />
		<hr>
		<NewPosts />
	</div>
</template>

<script>
import FormPost from '../components/FormPost';
import NewPosts from '../components/NewPosts';
export default {
	name: 'Board',
	components: {
		FormPost,
		NewPosts,
	},
	data() {
		return {
			newName: '',
		};
	},
	computed: {
		id() {
			return this.$route.params.id;
		},
		...mapGetters('board', [
			'boardName',
		]),
	},
	mounted() {
		this.init(this.id);
	},
	methods: {
		...mapActions('board', [
			'init',
			'renameBoard',
		]),
	},
}
</script>

<style scoped>

</style>