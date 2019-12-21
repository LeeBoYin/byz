import createStore from './create';
import boardStore from './board';
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
	createUser({ dispatch }, payload) {
		console.log('createUser');
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