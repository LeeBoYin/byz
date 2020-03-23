const state = {
	groups: {},
	groupsRef: null,
};
const getters = {
	groups: state => state.groups,
	orderedGroups(state, getters, rootState) {
		const groupIdList = _.get(rootState, ['board', 'board', 'groupIdList'], []);
		return _.map(groupIdList, (groupId) => {
			return state.groups[groupId];
		});
	},
};
const mutations = {
	setGroup(state, groupDoc) {
		Vue.set(state.groups, groupDoc.id, {
			id: groupDoc.id,
			ref: groupDoc.ref,
			...groupDoc.data(),
		});
	},
	setGroupsRef(state, groupsRef) {
		state.groupsRef = groupsRef;
	},
};
const actions = {
	async createGroup({ state, dispatch }) {
		const newGroup = {
			name: '',
		};
		await state.groupsRef.add(newGroup).then((groupRef) => {
			console.log("Group written with ID: ", groupRef.id);
			dispatch('updateBoard', {
				groupIdList: firebase.firestore.FieldValue.arrayUnion(groupRef.id),
			});
			return groupRef;
		}).catch((error) => {
			console.error("Error adding group: ", error);
		});
	},
	async getGroups({ state, commit }) {
		await state.groupsRef.get().then((groupsSnapshot) => {
			groupsSnapshot.forEach((groupDoc) => {
				commit('setGroup', groupDoc);
			});
		});

		// listen to groups change
		state.groupsRef.onSnapshot((groupsSnapshot) => {
			console.log('groups changed');
			groupsSnapshot.docChanges().forEach((change) => {
				if(change.type === 'added' || change.type === 'modified') {
					commit('setGroup', change.doc);
				}
			});
		});
	},
	async updateGroup({ state }, { groupId, updateObj }) {
		const group = state.groups[groupId];
		await group.ref.update(updateObj).then(() => {
			console.log('update group ' + groupId + ' success');
			// success
		}).catch(() => {
			// fail
		});
	},
	async deleteGroup({ state, getters, dispatch }, groupId) {
		const group = state.groups[groupId];
		// delete posts in the group before delete group
		_.forEach(group.postIdList, (postId) => {
			dispatch('deletePost', postId);
		});
		// remove groupId from board
		await dispatch('updateBoard', {
			groupIdList: firebase.firestore.FieldValue.arrayRemove(groupId),
		});
		// delete board
		await group.ref.delete().then(() => {
			// success
		}).catch(() => {
			// fail
		});
	},
};

export default {
	state,
	getters,
	mutations,
	actions,
};
