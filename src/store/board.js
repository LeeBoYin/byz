import Vue from 'vue';
import router from '../router';
const state = {
	board: null,
	boardRef: null,
	currentUserId: null,
	isInitialized: false,
	posts: {},
	postsRef: null,
	users: {},
	usersRef: null,
};
const getters = {
	boardName(state) {
		return _.get(state.board, 'name');
	},
	currentUser(state) {
		return _.get(state.users, state.currentUserId, null);
	},
};
const mutations = {
	setBoardRef(state, boardRef) {
		state.boardRef = boardRef;
	},
	setCurrentUserId(state, id) {
		state.currentUserId = id;
	},
	setInitialized(state, isInitialized) {
		state.isInitialized = isInitialized;
	},
	setPost(state, { id, post }) {
		Vue.set(state.posts, id, post);
	},
	setPostsRef(state, postsRef) {
		state.postsRef = postsRef;
	},
	setUser(state, { id, user }) {
		Vue.set(state.users, id, user);
	},
	setUsersRef(state, usersRef) {
		state.usersRef = usersRef;
	},
	updateBoard(state, board) {
		state.board = board;
	},
};
const actions = {
	async init({ dispatch, rootState, commit }, boardId) {
		commit('setBoardRef', rootState.db.collection('board').doc(boardId));
		commit('setPostsRef', state.boardRef.collection('posts'));
		commit('setUsersRef', state.boardRef.collection('users'));
		// TODO await all
		await dispatch('getBoard', boardId);
		await dispatch('getPosts');
		await dispatch('getUsers');
		commit('setCurrentUserId', window.localStorage.getItem('userId') || null);
		commit('setInitialized', true);
	},
	async createPost({ state }, post) {
		await state.postsRef.add(post).then((postRef) => {
			console.log("Post written with ID: ", postRef.id);
			return postRef;
		}).catch((error) => {
			console.error("Error adding post: ", error);
		});
	},
	async createUser({ state, commit }, user) {
		await state.usersRef.add(user).then((userRef) => {
			console.log("User written with ID: ", userRef.id);
			commit('setCurrentUserId', userRef.id);
			window.localStorage.setItem('userId', state.currentUserId);
			return userRef;
		}).catch((error) => {
			console.error("Error adding post: ", error);
		});
	},
	async getBoard({ commit, state, rootState, dispatch }) {
		await state.boardRef.get().then((boardSnapshot) => {
			if (!boardSnapshot.exists) {
				// doc.data() will be undefined in this case
				console.log('No such board!');
				dispatch('goToInvalid');
			}

			commit('updateBoard', boardSnapshot.data());

			// listen to board change
			state.boardRef.onSnapshot((boardSnapshot) => {
				commit('updateBoard', boardSnapshot.data());
			});
		}).catch((error) => {
			console.log('Error getting board:', error);
		});
	},
	async getPosts({ state, commit }) {
		await state.postsRef.get().then((postsSnapshot) => {
			postsSnapshot.forEach((postDoc) => {
				commit('setPost', {
					id: postDoc.id,
					post: postDoc.data(),
				});
			});
		});

		// listen to posts change
		state.postsRef.onSnapshot((postsSnapshot) => {
			console.log('posts changed');
			postsSnapshot.docChanges().forEach((change) => {
				console.log(change);
				if(change.type === 'added' || change.type === 'modified') {
					commit('setPost', {
						id: change.doc.id,
						post: change.doc.data(),
					});
				}
			});
		});
	},
	async getUsers({ commit }) {
		await state.usersRef.get().then((usersSnapshot) => {
			usersSnapshot.forEach((userDoc) => {
				commit('setUser', {
					id: userDoc.id,
					user: userDoc.data(),
				});
			});
		});

		// listen to users change
		state.usersRef.onSnapshot((usersSnapshot) => {
			console.log('users changed');
			usersSnapshot.docChanges().forEach((change) => {
				console.log(change);
				if(change.type === 'added' || change.type === 'modified') {
					commit('setUser', {
						id: change.doc.id,
						user: change.doc.data(),
					});
				}
			});
		});
	},
	goToInvalid() {
		router.push('/');
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};