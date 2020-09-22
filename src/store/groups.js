import { EventBus } from '@/main';

const state = {
	groups: {},
	groupsRef: null,
};
const getters = {
	groups: state => state.groups,
	orderedGroups(state, getters, rootState) {
		const groupIdList = _.get(rootState, ['board', 'board', 'groupIdList'], []);
		return _.filter(_.map(groupIdList, (groupId) => {
			return state.groups[groupId];
		}));
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
	async createGroup({ state, dispatch }, payload = {}) {
		await state.groupsRef.add({
			name: _.get(payload, 'name', ''),
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		}).then((groupRef) => {
			dispatch('updateBoard', {
				groupIdList: firebase.firestore.FieldValue.arrayUnion(groupRef.id),
			});
			return groupRef;
		}).catch((error) => {
			console.error("Error adding group: ", error);
		});
	},
	getGroups({ state, commit }) {
		return new Promise((resolve) => {
			// listen to groups change
			state.groupsRef.onSnapshot( ( groupsSnapshot ) => {
				groupsSnapshot.docChanges().forEach( ( change ) => {
					if ( change.type === 'added' || change.type === 'modified' ) {
						commit( 'setGroup', change.doc );
					}
					if (change.type === 'modified') {
						EventBus.$emit('modified.group');
					}
				} );
				resolve();
			} );
		});
	},
	async updateGroup({ state }, { groupId, updateObj }) {
		const group = state.groups[groupId];
		await group.ref.update(updateObj).then(() => {
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
		// delete group
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
