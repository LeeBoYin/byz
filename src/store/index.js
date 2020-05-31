import createStore from '@store/create';
import boardStore from '@store/board';
const state = {
	db: null,
};
const getters = {

};
const mutations = {
	setDB(state, db) {
		if (location.hostname === "localhost") {
			console.log('db host = localhost:8080');
			db.settings({
				host: "localhost:8080",
				ssl: false
			});
		}
		state.db = db;
	},
};
const actions = {
	init({ commit }) {
		commit('setDB', firebase.firestore());
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
