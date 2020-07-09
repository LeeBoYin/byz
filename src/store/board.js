import router from '@/router';
import commentsStore from '@store/comments';
import groupsStore from '@store/groups';
import postsStore from '@store/posts';
import usersStore from '@store/users';
const state = {
	board: null,
	boardRef: null,
	isInitialized: false,
	isShowPostArea: false,
	isGuestMode: false,
};
const getters = {
	boardId(state) {
		return _.get(state.boardRef, 'id');
	},
	boardName(state) {
		return _.get(state.board, 'name');
	},
	localData: (state, getters) => (key) => {
		return window.localStorage.getItem(`${ getters.boardId }:${ key }`);
	},
};
const mutations = {
	setBoardRef(state, boardRef) {
		state.boardRef = boardRef;
	},
	setInitialized(state, isInitialized) {
		state.isInitialized = isInitialized;
	},
	setIsGuestMode(state, isGuestMode) {
		state.isGuestMode = isGuestMode;
	},
	setIsShowPostArea(state, isShowPostArea) {
		state.isShowPostArea = isShowPostArea;
	},
	updateBoard(state, board) {
		state.board = board;
		document.title = _.get(state.board, 'name') + ' - BYZ';
	},
};
const actions = {
	async init({ getters, dispatch, rootState, commit }, boardId) {
		commit('setBoardRef', rootState.db.collection('board').doc(boardId));
		commit('setGroupsRef', state.boardRef.collection('groups'));
		commit('setPostsRef', state.boardRef.collection('posts'));
		commit('setUsersRef', state.boardRef.collection('users'));
		await Promise.all([
			dispatch('getBoard'),
			dispatch('getGroups'),
			dispatch('getPosts'),
			dispatch('getUsers'),
		]);
		commit('setCurrentUserId', getters.localData('userId') || null);
		commit('setInitialized', true);
	},
	async getBoard({ commit, state, dispatch }) {
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
	leaveGuestMode({ commit }) {
		commit('setIsGuestMode', false);
	},
	setLocalData({ getters }, data) {
		_.forEach(data, (value, key) => {
			window.localStorage.setItem(`${ getters.boardId }:${ key }`, value);
		});
	},
	setIsShowPostArea({ getters, dispatch, commit }, value) {
		commit('setIsShowPostArea', value);
		dispatch('setLocalData', {
			isShowPostArea: value,
		});
	},
	viewAsGuest({ commit }) {
		commit('setIsGuestMode', true);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
	modules: {
		commentsStore,
		groupsStore,
		postsStore,
		usersStore,
	},
};
