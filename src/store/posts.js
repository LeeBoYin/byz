const state = {
	posts: {},
	postsRef: null,
};
const getters = {
	getPostById: (state) => (postId) => {
		return state.posts[postId];
	},
	getPostGroupId: (state, getters) => (postId) => {
		const group = _.find(getters.groups, (group) => {
			return _.includes(group.postIdList, postId);
		});
		return _.get(group, 'id', null);
	},
	getPostsByGroupId: (state, getters) => (groupId) => {
		const group = getters.groups[groupId];
		return _.map(group.postIdList, (postId) => {
			return state.posts[postId];
		});
	},
	newPosts(state, getters) {
		const groupedPostsId = _.union(..._.map(getters.groups, 'postIdList'));
		const newPosts = _.filter(state.posts, (post) => {
			return !_.includes(groupedPostsId, post.id);
		});
		return _.sortBy(newPosts, (post) => {
			return _.get(post, ['timestamp', 'seconds'], Infinity);
		});
	},
	postCount(state) {
		return _.size(state.posts);
	},
};
const mutations = {
	removePost(state, postId) {
		Vue.delete(state.posts, postId);
	},
	setPost(state, postDoc) {
		Vue.set(state.posts, postDoc.id, {
			id: postDoc.id,
			ref: postDoc.ref,
			...postDoc.data(),
		});
	},
	setPostsRef(state, postsRef) {
		state.postsRef = postsRef;
	},
};
const actions = {
	async createPost({ state, dispatch }, { post, groupId }) {
		const postId = await state.postsRef.add({
			...post,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		}).then((postRef) => {
			return postRef.id;
		}).catch((error) => {
			console.error("Error adding post: ", error);
		});
		await dispatch('updateGroup', {
			groupId,
			updateObj: {
				postIdList: firebase.firestore.FieldValue.arrayUnion(postId),
			},
		});
	},
	getPosts({ state, commit }) {
		return new Promise((resolve) => {
			// get and listen to posts change
			state.postsRef.onSnapshot((postsSnapshot) => {
				postsSnapshot.docChanges().forEach((change) => {
					if(change.type === 'added' || change.type === 'modified') {
						commit('setPost', change.doc);
					}
					if(change.type === 'removed') {
						commit('removePost', change.doc.id);
					}
				});
				resolve();
			});
		});
	},
	async updatePost({ state }, { postId, updateObj }) {
		await state.posts[postId].ref.update(updateObj).then(() => {
			// success
		}).catch(() => {
			// fail
		});
	},
	async deletePost({ state, getters, dispatch }, postId) {
		const groupId = getters.getPostGroupId(postId);
		if(groupId) {
			// remove post from group before delete post
			dispatch('updateGroup', {
				groupId,
				updateObj: {
					postIdList: firebase.firestore.FieldValue.arrayRemove(postId),
				},
			});
		}
		state.posts[postId].ref.delete().then(() => {
			// success
		}).catch(() => {
			// fail
		});
	},
	async togglePostPin({ getters, dispatch }, postId) {
		const post = getters.getPostById(postId);
		await dispatch('updatePost', {
			postId,
			updateObj: {
				isPinned: !post.isPinned,
			}
		});
		const groupId = getters.getPostGroupId(postId);
		const posts = getters.getPostsByGroupId(groupId);
		const sortedPostIdList = _.map([
			..._.filter(posts, post => post.isPinned),
			..._.filter(posts, post => !post.isPinned)
		], 'id');
		await dispatch('updateGroup', {
			groupId: groupId,
			updateObj: {
				postIdList: sortedPostIdList,
			},
		});
	},
};

export default {
	state,
	getters,
	mutations,
	actions,
};
