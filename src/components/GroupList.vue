<template>
	<div class="group-list">
		<Group
			v-for="group in orderedGroups"
			:key="group.id"
			:group="group"
			class="group-list__group"
		/>
		<button v-if="!isGuestMode" class="group-list__btn-add" @click="onClickCreate">
			<i class="las la-plus"></i>
		</button>
	</div>
</template>

<script>
import Group from '@components/Group';
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
		...mapState('board', [
			'isGuestMode',
		]),
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
			handle: '.group--draggable .group__header',
			dataIdAttr: 'data-group-id',
			ghostClass: "sortable-ghost",
			chosenClass: "sortable-chosen",
			dragClass: "sortable-drag",
			direction: 'horizontal',
			emptyInsertThreshold: 20,
			onStart(e) {
			},
			onEnd() {
			},
			onSort() {
				groupList.updateBoard({
					groupIdList: groupList.sortable.toArray(),
				});
			},
		});
	},
	methods: {
		async onClickCreate() {
			this.createGroup({
				name: '',
			});
		},
		...mapActions('board', [
			'createGroup',
			'updateBoard',
		]),
	},
}
</script>
