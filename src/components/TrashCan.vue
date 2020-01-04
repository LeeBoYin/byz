<template>
	<div id="trash-can"></div>
</template>

<script>
import Sortable from 'sortablejs';
export default {
	data() {
		return {
			sortable: null,
		};
	},
	mounted() {
		const trashCan = this;
		this.sortable = Sortable.create(this.$el, {
			group: {
				name: null,
				pull: false,
				put: true,
			},
			ghostClass: 'in-trash-can',
			onAdd(e) {
				if(e.item.getAttribute('data-post-id')) {
					trashCan.deletePost(e.item.getAttribute('data-post-id'));
				}
				if(e.item.getAttribute('data-group-id')) {
					trashCan.deleteGroup(e.item.getAttribute('data-group-id'));
				}
			},
		});
	},
	methods: {
		...mapActions('board', [
			'deleteGroup',
			'deletePost',
		]),
	},
}
</script>

<style scoped>
#trash-can {
	position: fixed;
	width: 80px;
	height: 80px;
	background-image: url('../assets/img/trashcan.png');
	background-size: cover;
	bottom: 10px;
	left: 800px;
	transition: .2s ease-out;
}
#trash-can:not(:empty) {
	transform: scale(1.5);
}
</style>