<template>
	<div id="app">
		<h1>
			Firebase
		</h1>
		<!-- sing in / sign out -->
		<template v-if="isSignedIn">
			<strong>Hello {{ user.displayName }} ({{ user.email }})</strong>
			<button @click="signOut">Sign out</button>
		</template>
		<template v-else>
			<button @click="signInGoogle">Sign in with Google</button>
			<div>
				<label>
					email:
					<input type="email" v-model="email">
				</label>
				<label>
					password:
					<input type="password" v-model="password">
				</label>
				<button @click="signUpWithEmail">Sign up</button>
				<button @click="signInWithEmail">Sign in</button>
			</div>
		</template>
		<!-- create post -->
		<FormPost v-if="isSignedIn" />
	</div>
</template>

<script>
import FormPost from '@components/PostForm';
export default {
	components: {
		FormPost
	},
	data() {
		return {
			user: null,
			email: '',
			password: '',
		};
	},
	computed: {
		isSignedIn() {
			return !!this.user;
		},
	},
	mounted() {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				// User is signed in.
				console.log('user is signed in');
				this.user = user;
				// ...
			} else {
				// User is signed out.
				this.user = null;
				console.log('user is signed out');
				// ...
			}
		});
	},
	methods: {
		toggleSignUpBlock() {

		},
		signInGoogle() {
			const provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().signInWithPopup(provider).then((result) => {
				// This gives you a Google Access Token. You can use it to access the Google API.
				const token = result.credential.accessToken;
				// The signed-in user info.
				console.log('signed in with Google');
			}).catch((error) => {
				// Handle Errors here.
				const errorCode = error.code;
				const errorMessage = error.message;
				// The email of the user's account used.
				const email = error.email;
				// The firebase.auth.AuthCredential type that was used.
				const credential = error.credential;
				// ...
			});
		},
		signInWithEmail() {
			firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
				console.log('sign in success');
			}).catch((e) => {
				console.log('sign in fail');
				console.log(e);
			});
		},
		signUpWithEmail() {
			firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(() => {
				console.log('sign up success');
			}).catch((e) => {
				console.log('sign up fail');
				console.log(e);
			});
		},
		signOut() {
			firebase.auth().signOut();
		},
	},
};
</script>

<style>
</style>
