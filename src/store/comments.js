import { EventBus } from '@/main';

const state = {
	comments: {},
	unsubscribeFunc: {},
};
const getters = {
	getCommentsByPostId: (state) => (postId) => {
		const comments = _.filter(state.comments, ['postId', postId]);
		return _.orderBy(comments, (comment) => {
			return _.get(comment, ['timestamp', 'seconds'], Infinity);
		});
	},
	getUnsubscribeFuncByPostId: (state) => (postId) => {
		return _.get(state.unsubscribeFunc, postId, null);
	},
};
const mutations = {
	removeComment(state, commentId) {
		Vue.delete(state.comments, commentId);
	},
	setComment(state, payload) {
		Vue.set(state.comments, payload.commentDoc.id, {
			id: payload.commentDoc.id,
			ref: payload.commentDoc.ref,
			postId: payload.postId,
			...payload.commentDoc.data(),
		});
	},
	setUnsubscribeFunc(state, payload) {
		Vue.set(state.unsubscribeFunc, payload.postId, payload.unsubscribeFunc);
	},
};
const actions = {
	createComment({ state, getters }, payload) {
		const post = getters.getPostById(payload.postId);
		post.ref.collection('comments').add({
			...payload.comment,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		}).then((commentRef) => {
			return commentRef;
		}).catch((error) => {
			console.error("Error adding comment: ", error);
		});
	},
	fetchCommentsByPostId({ state, commit, getters }, postId) {
		const post = getters.getPostById(postId);
		const commentsRef = post.ref.collection('comments');
		return new Promise((resolve) => {
			const unsubscribeFunc = commentsRef.onSnapshot((commentsSnapshot) => {
				commentsSnapshot.docChanges().forEach((change) => {
					if(change.type === 'added' || change.type === 'modified') {
						commit('setComment', {
							postId,
							commentDoc: change.doc,
						});
						if(change.type === 'added') {
							EventBus.$emit('added.comment');
						}
					}
					if(change.type === 'removed') {
						commit('removeComment', change.doc.id);
					}
				});
				resolve();
			});

			commit('setUnsubscribeFunc', {
				postId,
				unsubscribeFunc,
			});
		});
	},
	stopFetchCommentsByPostId({ getters }, postId) {
		const unsubscribeFunc = getters.getUnsubscribeFuncByPostId(postId);
		if(_.isFunction(unsubscribeFunc)) {
			unsubscribeFunc();
		}
	},
	async updateComment({ state }, { commentId, updateObj }) {
		await state.comments[commentId].ref.update(updateObj).then(() => {
			// success
		}).catch(() => {
			// fail
		});
	},
	async deleteComment({ state, getters, dispatch }, commentId) {
		state.comments[commentId].ref.delete().then(() => {
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
