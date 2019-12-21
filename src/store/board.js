import Vue from 'vue';
import router from '../router';
const state = {
	isInitialized: false,
	board: null,
	boardRef: null,
	posts: {},
	postsRef: null,
};
const getters = {
	boardName(state) {
		return _.get(state.board, 'name');
	},
};
const mutations = {
	setBoardRef(state, boardRef) {
		state.boardRef = boardRef;
	},
	setPostsRef(state, postsRef) {
		state.postsRef = postsRef;
	},
	setInitialized(state, isInitialized) {
		state.isInitialized = isInitialized;
	},
	setPosts(state, posts) {
		state.posts = posts;
	},
	updateBoard(state, board) {
		state.board = board;
	},
	addPosts(state, { id, post }) {
		Vue.set(state.posts, id, post);
	},
};
const actions = {
	async init({ dispatch, rootState, commit }, boardId) {
		commit('setBoardRef', rootState.db.collection('board').doc(boardId));
		commit('setPostsRef', state.boardRef.collection('posts'));
		await dispatch('getBoard', boardId);
		await dispatch('getPosts');
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
		// listen to posts change
		state.postsRef.onSnapshot((postsSnapshot) => {
			console.log('posts changed');
			postsSnapshot.docChanges().forEach((change) => {
				console.log(change);
				if(change.type === 'added' || change.type === 'modified') {
					commit('addPosts', {
						id: change.doc.id,
						post: change.doc.data(),
					});
				}
			});
		});
	},
	goToInvalid() {
		router.push('/');
	},
	renameBoard({ commit, state }, newName) {
		state.boardRef.update({
			name: newName
		}).then(() => {
			console.log('name updated');
		}).catch(() => {
			console.log('name update failed');
		});
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};