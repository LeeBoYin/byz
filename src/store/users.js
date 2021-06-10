import constants from '@/constants';

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
	userCount(state) {
		return _.size(state.users);
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
		if(!userId) {
			return;
		}
		commit('setCurrentUserId', userId);
		dispatch('board/setLocalData', {
			userId: userId,
		}, { root: true });
		dispatch('watchUserActivity');
	},
	watchUserActivity({ state, dispatch }) {
		const USER_ACTION_EVENTS = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
		const WINDOW_EVENTS = ['scroll', 'focus'];
		const onUserActive = _.throttle(() => {
			dispatch('updateUser', {
				userId: state.currentUserId,
				updateObj: {
					lastActiveTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
				},
			});
		}, constants.userActivityWatchIntervalSecond * 1000, {
			leading: true,
			trailing: false,
		});
		_.forEach(USER_ACTION_EVENTS, name => {
			document.addEventListener(name, onUserActive);
		});
		_.forEach(WINDOW_EVENTS, name => {
			window.addEventListener(name, onUserActive);
		})
	},
};

export default {
	state,
	getters,
	mutations,
	actions,
};
