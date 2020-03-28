import createStore from '@store/create';
import boardStore from '@store/board';
const state = {
	db: null,
};
const getters = {

};
const mutations = {
	setDB(state, db) {
		state.db = db;
	},
};
const actions = {
	init({ commit }) {
		commit('setDB', firebase.firestore());
		console.log('init');
	},
};

export default {
	state,
	getters,
	mutations,
	actions,
	modules: {
		create: createStore,
		board: boardStore,
	},
};
