const state = {
	currentUserId: null,
	users: {},
	usersRef: null,
};
const getters = {
	currentUser(state) {
		return _.get(state.users, state.currentUserId, null);
	},
	users(state) {
		return state.users;
	},
};
const mutations = {
	setCurrentUserId(state, id) {
		state.currentUserId = id;
	},
	setUser(state, { id, user }) {
		Vue.set(state.users, id, user);
	},
	setUsersRef(state, usersRef) {
		state.usersRef = usersRef;
	},
};
const actions = {
	async createUser({ state, commit, dispatch, rootGetters }, user) {
		await state.usersRef.add(user).then((userRef) => {
			console.log("User written with ID: ", userRef.id);
			commit('setCurrentUserId', userRef.id);
			dispatch('board/setLocalData', {
				userId: state.currentUserId,
			}, { root: true });
			return userRef;
		}).catch((error) => {
			console.error("Error adding user: ", error);
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
				if(change.type === 'added' || change.type === 'modified') {
					commit('setUser', {
						id: change.doc.id,
						user: change.doc.data(),
					});
				}
			});
		});
	},
};

export default {
	state,
	getters,
	mutations,
	actions,
};
