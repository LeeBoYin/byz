<template>
	<TransitionGroup
		tag="div"
		class="post-list"
		name="post-list"
	>
		<Post v-for="post in posts" :key="post.id" :post="post" />
	</TransitionGroup>
</template>

<script>
import Post from '@components/Post';
import { Sortable, AutoScroll } from 'sortablejs/modular/sortable.core.esm';
Sortable.mount(new AutoScroll());
export default {
	components: {
		Post,
	},
	props: {
		groupId: String,
		posts: Array,
	},
	data() {
		return {
			sortable: null,
		};
	},
	computed: {
		...mapGetters('board', [
			'getPostById',
		]),
	},
	mounted() {
		const postList = this;
		this.sortable = Sortable.create(this.$el, {
			group: {
				name: 'post',
				pull: true,
				put: !!postList.groupId,
			},  // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
			sort: !!postList.groupId,  // sorting inside list
			delay: 150, // time in milliseconds to define when the sorting should start
			delayOnTouchOnly: true, // only delay if user is using touch
			touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
			disabled: false, // Disables the sortable if set to true.
			store: null,  // @see Store
			animation: 150,  // ms, animation speed moving items when sorting, `0` — without animation
			easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
			handle: ".post--draggable",  // Drag handle selector within list items
			// filter: ".ignore-elements",  // Selectors that do not lead to dragging (String or Function)
			// preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
			draggable: ".post",  // Specifies which items inside the element should be draggable

			dataIdAttr: 'data-post-id',

			ghostClass: "sortable-ghost",  // Class name for the drop placeholder
			chosenClass: "sortable-chosen",  // Class name for the chosen item
			dragClass: "sortable-drag",  // Class name for the dragging item

			swapThreshold: 1, // Threshold of the swap zone
			invertSwap: false, // Will always use inverted swap zone if set to true
			invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
			direction: 'vertical', // Direction of Sortable (will be detected automatically if not given)

			forceFallback: false,  // ignore the HTML5 DnD behaviour and force the fallback to kick in

			fallbackClass: "sortable-fallback",  // Class name for the cloned DOM Element when using forceFallback
			fallbackOnBody: false,  // Appends the cloned DOM Element into the Document's Body
			fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.

			dragoverBubble: false,
			removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
			emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it


			setData(/** DataTransfer */dataTransfer, /** HTMLElement*/dragEl) {
				dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
			},

			// Element is chosen
			onChoose(e) {
				e.oldIndex;  // element index within parent
			},

			// Element is unchosen
			onUnchoose(e) {
				// same properties as onEnd
			},

			// Element dragging started
			onStart(e) {
				e.oldIndex;  // element index within parent
			},

			// Element dragging ended
			onEnd(e) {
				// const itemEl = e.item;  // dragged HTMLElement
				// e.to;    // target list
				// e.from;  // previous list
				// e.oldIndex;  // element's old index within old parent
				// e.newIndex;  // element's new index within new parent
				// e.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
				// e.newDraggableIndex; // element's new index within new parent, only counting draggable elements
				// e.clone // the clone element
				// e.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving
			},

			// Element is dropped into the list from another list
			onAdd(e) {
				// same properties as onEnd
				postList.updateGroupPostList(e.to.dataset.groupId, postList.sortable.toArray());
				// remove added sortable item
				const unwatch = postList.$watch('posts', () => {
					e.item.remove();
					unwatch();
				});
			},

			// Changed sorting within list
			onUpdate(e) {
				// same properties as onEnd
			},

			// Called by any change to the list (add / update / remove)
			onSort(e) {
				// check if post pin should be removed
				const groupId = e.to.dataset.groupId;
				if(groupId === postList.groupId) {
					const unwatch = postList.$watch('posts', () => {
						unwatch();

						const postId = e.item.dataset.postId;
						const post = postList.getPostById(postId);
						const postIndex = _.findIndex(postList.posts, ['id', postId]);
						const postsAtFront = _.slice(postList.posts, 0, postIndex);
						const isSomeUnpinnedAtFront = _.some(postsAtFront, post => !post.isPinned);
						if(post.isPinned && isSomeUnpinnedAtFront) {
							postList.togglePostPin(postId);
						}
					});
				}

				if(e.from.dataset.groupId === e.to.dataset.groupId) {
					postList.updateGroupPostList(e.to.dataset.groupId, postList.sortable.toArray());
				}
			},

			// Element is removed from the list into another list
			onRemove(e) {
				// same properties as onEnd
				postList.updateGroupPostList(e.from.dataset.groupId, postList.sortable.toArray());
			},

			// Attempt to drag a filtered element
			onFilter(e) {
				const itemEl = e.item;  // HTMLElement receiving the `mousedown|tapstart` event.
			},

			// Event when you move an item in the list or between lists
			onMove(e, /**Event*/originalEvent) {
				// Example: https://jsbin.com/nawahef/edit?js,output
				e.dragged; // dragged HTMLElement
				e.draggedRect; // DOMRect {left, top, right, bottom}
				e.related; // HTMLElement on which have guided
				e.relatedRect; // DOMRect
				e.willInsertAfter; // Boolean that is true if Sortable will insert drag element after target by default
				originalEvent.clientY; // mouse position
				// return false; — for cancel
				// return -1; — insert before target
				// return 1; — insert after target
			},

			// Called when creating a clone of element
			onClone(e) {
				const origEl = e.item;
				const cloneEl = e.clone;
			},

			// Called when dragging element changes position
			onChange(e) {
				e.newIndex // most likely why this event is used is to get the dragging element's current index
				// same properties as onEnd
			},
			// revertOnSpill: true, // Enable plugin
			// // Called when item is spilled
			// onSpill: function(/**Event*/evt) {
			// 	evt.item // The spilled item
			// }
		});
	},
	methods: {
		updateGroupPostList(groupId, postIdList) {
			if(!groupId) {
				return;
			}
			// prevent duplicate post in one group
			postIdList = _.uniq(postIdList);
			this.updateGroup({
				groupId,
				updateObj: {
					postIdList,
				},
			});
		},
		...mapActions('board', [
			'togglePostPin',
			'updateGroup',
		]),
	},
}

// onChoose
// setData
// onClone
// onStart
// onMove
// onChange
// onUnchoose
// onAdd
// onRemove
// onSort
// onSort
// onEnd
</script>
