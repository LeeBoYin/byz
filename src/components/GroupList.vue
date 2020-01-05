<template>
	<div class="group-list">
		<Group v-for="group in orderedGroups" :key="group.id" :group="group"
		/><button class="btn" @click="createGroup">+ Group</button>
	</div>
</template>

<script>
import Group from './Group';
import Sortable from 'sortablejs';
export default {
	components: {
		Group,
	},
	data() {
		return {
			sortable: null,
		};
	},
	computed: {
		...mapGetters('board', [
			'orderedGroups',
		]),
	},
	mounted() {
		const groupList = this;
		this.sortable = Sortable.create(this.$el, {
			group: {
				name: 'group',
				pull: true,
				put: false,
			},
			sort: true,
			delay: 150,
			delayOnTouchOnly: true,
			animation: 300,
			easing: "cubic-bezier(1, 0, 0, 1)",
			draggable: ".group",
			dataIdAttr: 'data-group-id',
			ghostClass: "sortable-ghost",
			chosenClass: "sortable-chosen",
			dragClass: "sortable-drag",
			direction: 'horizontal',
			emptyInsertThreshold: 20,
			onSort() {
				groupList.updateBoard({
					groupIdList: groupList.sortable.toArray(),
				});
			},
		});
	},
	methods: {
		...mapActions('board', [
			'createGroup',
			'updateBoard',
		]),
	},
}
</script>

<style scoped>
.group-list {
	overflow-x: auto;
	display: flex;
	flex-wrap: nowrap;
	align-items: flex-start;
}
</style>