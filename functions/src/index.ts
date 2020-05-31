import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();

export const helloWorld = functions.https.onRequest((request, response) => {
	response.send("Hello from Firebase!!!!!!");
});

export const onCreateComment = functions.firestore
	.document('/board/{boardId}/posts/{postId}/comments/{commentId}')
	.onCreate(async (snapshot, context) => {
		const postRef = snapshot.ref.parent.parent;
		if(!postRef) {
			console.error('postRef not exist');
			return null;
		}
		return new Promise(async (resolve, reject) => {
			try {
				// check post exist first
				const postSnapshot = await postRef.get();
				if(!postSnapshot.exists) {
					resolve();
				}
				// increment commentCount
				await postRef.update({
					commentCount: admin.firestore.FieldValue.increment(1),
				});
				resolve();
			} catch (e) {
				reject();
			}
		});
	});

export const onDeleteComment = functions.firestore
	.document('/board/{boardId}/posts/{postId}/comments/{commentId}')
	.onDelete(async (snapshot, context) => {
		const postRef = snapshot.ref.parent.parent;
		if(!postRef) {
			console.error('postRef not exist');
			return null;
		}
		return new Promise(async (resolve, reject) => {
			try {
				// check post exist first
				const postSnapshot = await postRef.get();
				if(!postSnapshot.exists) {
					resolve();
				}
				// decrement commentCount
				await postRef.update({
					commentCount: admin.firestore.FieldValue.increment(-1),
				});
				resolve();
			} catch (e) {
				reject();
			}
		});
	});

export const onDeletePost = functions.firestore
	.document('/board/{boardId}/posts/{postId}')
	.onDelete(async (snapshot, context) => {
		const commentsRef = snapshot.ref.collection('comments');
		return new Promise(async (resolve, reject) => {
			try {
				const commentsSnapshot = await commentsRef.get();
				if(commentsSnapshot.empty) {
					resolve();
				}
				// delete all comments
				const deletePromises: Promise<any>[] = [];
				commentsSnapshot.forEach(function(doc) {
					deletePromises.push(doc.ref.delete());
				});
				await Promise.all(deletePromises);
				resolve();
			} catch (e) {
				reject();
			}
		});
	});
