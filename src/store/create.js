import constants from '@/constants';

const state = {

};
const getters = {

};
const mutations = {

};
const actions = {
	async createBoard({ dispatch, rootState }, { boardName, userName }) {
		const boardRef = await rootState.db.collection('board').add({
			name: boardName,
			isAllowJoin: true,
		}).then((boardRef) => {
			return boardRef;
		}).catch((error) => {
			console.error("Error adding board: ", error);
		});
		await dispatch('createGroups', { boardRef });
		return boardRef;
	},
	async createGroups(context, { boardRef }) {
		const groupIdList = [];
		const promises = [];
		for(let i = 0; i < constants.groupNum; i++) {
			promises.push(new Promise((resolve) => {
				boardRef.collection( 'groups' ).add( { name: '' } ).then(( groupRef) => {
					groupIdList.push(groupRef.id);
					resolve();
				} );
			}));
		}
		await Promise.all(promises);
		await boardRef.update({ groupIdList });
	},
};
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};
