<template>
	<div class="form-post">
		<label>
			Type Something:
			{{ _.get({ a: 1}, 'a') }}
			<input type="text" v-model="content">
		</label>
		<button :disabled="!isSubmittable" @click="submit">Post</button>
		<div v-if="isLoading">Posting...</div>
		<ul>
			<li v-for="post in posts">{{ post.content }}</li>
		</ul>
		<button @click="readPosts">Read</button>
	</div>
</template>

<script>
import _ from 'lodash';
import * as firebase from "firebase/app";
export default {
	name: 'FormPost',
	data() {
		return {
			content: '',
			db: null,
			isLoading: false,
			posts: [],
		};
	},
	computed: {
		isSubmittable() {
			return this.content.length > 0;
		},
	},
	mounted() {
		this.db = firebase.firestore();
	},
	methods: {
		submit() {
			if(!this.isSubmittable) {
				return;
			}
			this.isLoading = true;
			this.db.collection("post").add({
				content: this.content,
				createTime: firebase.firestore.Timestamp.fromDate(new Date()),
			})
			.then((docRef) => {
				console.log("Document written with ID: ", docRef.id);
				this.content = '';
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			})
			.finally(() => {
				this.isLoading = false;
			});
		},
		readPosts() {
			this.db.collection("post").get().then((querySnapshot) => {
				console.log(querySnapshot);
				this.posts = _.map(querySnapshot.docs, (doc) => {
					return doc.data();
				});
			});
		},
	},
}
</script>

<style scoped>
.form-post {
	border: 1px solid #EAEAEA;
	border-radius: 4px;
	padding: 10px 20px;
	margin: 10px 0;
}
</style>