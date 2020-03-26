import Vue from 'vue';
import router from '../router';
import groupsStore from './groups';
import postsStore from './posts';
import usersStore from './users';
const state = {
	board: null,
	boardRef: null,
	draggedItem: null,
	isInitialized: false,
	isShowPostArea: true,
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
	setInitialized(state, isInitialized) {
		state.isInitialized = isInitialized;
	},
	updateBoard(state, board) {
		state.board = board;
	},
	updateDraggedItem(state, item) {
		state.draggedItem = item;
	},
	updateIsShowPostArea(state, isShowPostArea) {
		state.isShowPostArea = isShowPostArea;
	},
};
const actions = {
	async init({ dispatch, rootState, commit }, boardId) {
		commit('setBoardRef', rootState.db.collection('board').doc(boardId));
		commit('setGroupsRef', state.boardRef.collection('groups'));
		commit('setPostsRef', state.boardRef.collection('posts'));
		commit('setUsersRef', state.boardRef.collection('users'));
		// TODO await all
		await Promise.all([
			dispatch('getBoard'),
			dispatch('getGroups'),
			dispatch('getPosts'),
			dispatch('getUsers'),
		]);
		commit('setCurrentUserId', window.localStorage.getItem('userId') || null);
		commit('setInitialized', true);
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
	async updateBoard({ state }, updateObj) {
		await state.boardRef.update(updateObj).then(() => {
			// success
		}).catch(() => {
			// fail
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
	modules: {
		groupsStore,
		postsStore,
		usersStore,
	},
};
