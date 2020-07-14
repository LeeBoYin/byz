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
	getUserById: (state) => (userId) => {
		return _.get(state.users, userId);
	},
	getUsersById: (state, getters) => (usersId = []) => {
		return _.map(usersId, userId => getters.users[userId]);
	},
};
const mutations = {
	setCurrentUserId(state, id) {
		state.currentUserId = id;
	},
	setUser(state, userDoc) {
		Vue.set(state.users, userDoc.id, {
			id: userDoc.id,
			ref: userDoc.ref,
			...userDoc.data(),
		});
	},
	setUsersRef(state, usersRef) {
		state.usersRef = usersRef;
	},
};
const actions = {
	async createUser({ state, commit, dispatch }, user) {
		await state.usersRef.add({
			...user,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		}).then((userRef) => {
			dispatch('setUserId', userRef.id);
			return userRef;
		}).catch((error) => {
			console.error("Error adding user: ", error);
		});
	},
	async updateUser({ state }, { userId, updateObj }) {
		await state.users[userId].ref.update(updateObj).then(() => {
			// success
		}).catch(() => {
			// fail
		});
	},
	getUsers({ commit }) {
		return new Promise((resolve) => {
			// get and listen to users change
			state.usersRef.onSnapshot((usersSnapshot) => {
				usersSnapshot.docChanges().forEach((change) => {
					if(change.type === 'added' || change.type === 'modified') {
						commit('setUser', change.doc);
					}
				});
				resolve();
			});
		});
	},
	setUserId({ commit, dispatch }, userId) {
		commit('setCurrentUserId', userId);
		dispatch('board/setLocalData', {
			userId: userId,
		}, { root: true });
	},
};

export default {
	state,
	getters,
	mutations,
	actions,
};
