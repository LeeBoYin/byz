const state = {

};
const getters = {

};
const mutations = {

};
const actions = {
	async createBoard({ dispatch, rootState }, { boardName, userName }) {
		console.log(boardName, userName);
		return await rootState.db.collection('board').add({
			name: boardName,
			isAllowJoin: true,
		}).then((boardRef) => {
			console.log("Board written with ID: ", boardRef.id);
			return boardRef;
		}).catch((error) => {
			console.error("Error adding board: ", error);
		});
	},
};
export default {
	namespaced: true,
	state,
	getters,
	mutations,
	actions,
};