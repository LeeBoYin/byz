const state = {
	comments: {},
	unsubscribeFunc: {},
};
const getters = {
	getCommentsByPostId: (state) => (postId) => {
		if(_.isNil(state.comments[postId])) {
			return null;
		}
		return _.orderBy(state.comments[postId], (comment) => {
			return _.get(comment, ['timestamp', 'seconds'], moment().unix() + 60);
		});
	},
	getUnsubscribeFuncByPostId: (state) => (postId) => {
		return _.get(state.unsubscribeFunc, postId, null);
	},
};
const mutations = {
	removePost(state, commentId) {
		Vue.delete(state.comments, commentId);
	},
	setComment(state, payload) {
		if(!_.isObject(state.comments[payload.postId])) {
			Vue.set(state.comments, payload.postId, {});
		}
		Vue.set(state.comments[payload.postId], payload.commentDoc.id, {
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
		post.ref.collection('comments').add(payload.comment).then((commentRef) => {
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
	}
};
export default {
	state,
	getters,
	mutations,
	actions,
};
