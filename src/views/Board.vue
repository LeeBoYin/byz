<template>
	<div>
		<div class="loading-msg" v-if="!isInitialized">
			Loading board...
		</div>
		<UserForm v-else-if="!currentUser" />
		<template v-else>
			<h1>Board!</h1>
			<div>board ID: {{ id }}</div>
			<div>board name: {{ boardName }}</div>
			<hr>
			<div>
				<h1>Set board name</h1>
				<input type="text" v-model="newName" @keypress.enter="renameBoard(newName)">
				<a class="btn" :disabled="!newName.length" @click="renameBoard(newName)">rename</a>
			</div>
			<hr>
			<PostForm />
			<hr>
			<PostList />
		</template>
	</div>
</template>

<script>
import UserForm from '../components/UserForm';
import PostForm from '../components/PostForm';
import PostList from '../components/PostList';
export default {
	components: {
		UserForm,
		PostForm,
		PostList,
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
		...mapState('board', [
			'isInitialized',
		]),
		...mapGetters('board', [
			'boardName',
			'currentUser',
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
};
</script>

<style scoped>

</style>