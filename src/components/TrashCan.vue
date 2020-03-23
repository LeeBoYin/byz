<template>
	<i
		id="trash-can"
		:class="{ 'drag-over': dragOver }"
		class="las la-trash"
		@dragenter="onDragEnter"
		@dragleave="onDragLeave"
		@dragover="onDragOver"
		@drop="onDrop"></i>
</template>

<script>
export default {
	data() {
		return {
			dragOver: false,
		};
	},
	computed: {
		...mapState('board', [
			'draggedItem',
		]),
	},
	methods: {
		onDragEnter(e) {
			this.dragOver = true;
			console.log('onDragEnter');
			console.log(e);
		},
		onDragLeave(e) {
			this.dragOver = false;
			console.log('onDragLeave');
			console.log(e);
		},
		onDragOver(e) {
			// prevent default to allow drop
			e.preventDefault();
		},
		onDrop() {
			this.dragOver = false;
			if(!this.draggedItem) {
				return;
			}
console.log('onDrop');
			if(this.draggedItem.getAttribute('data-post-id')) {
				this.deletePost(this.draggedItem.getAttribute('data-post-id'));
			}
			if(this.draggedItem.getAttribute('data-group-id')) {
				this.deleteGroup(this.draggedItem.getAttribute('data-group-id'));
			}
			this.updateDraggedItem(null);

		},
		...mapMutations('board', [
			'updateDraggedItem',
		]),
		...mapActions('board', [
			'deleteGroup',
			'deletePost',
		]),
	},
}
</script>

<style lang="scss" scoped>
@import '~@style/custom';
$c-trash: #AAA;
$c-trash-hover: #333;
#trash-can {
	position: fixed;
	font-size: 40px;
	color: $c-primary;
	border: 3px solid $c-primary;
	border-radius: 50%;
	bottom: 20px;
	background-color: rgba(255, 255, 255, 0.8);
	padding: 6px;
	left: 800px;
	transition: .2s ease-out;
	&.drag-over {
		transform: scale(1.5);
		color: $c-primary-dark;
		border-color: $c-primary-dark;
	}
	> * {
		display: none;
	}
}
</style>
