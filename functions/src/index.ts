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
		return postRef.update({
			commentCount: admin.firestore.FieldValue.increment(1),
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
		return postRef.update({
			commentCount: admin.firestore.FieldValue.increment(-1),
		});
	});
