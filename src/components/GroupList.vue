<template>
	<div class="group-list">
		<Group
			v-for="group in orderedGroups"
			:key="group.id"
			:group="group"
		/>
		<GroupForm
			v-if="isCreating"
			@cancel="isCreating = false"
			@created="isCreating = false"
		/>
		<button v-if="!isGuestMode && !isCreating" class="group-list__btn-add" @click="onClickCreate">
			<i class="las la-plus"></i>
		</button>
	</div>
</template>

<script>
import Group from '@components/Group';
import GroupForm from '@components/GroupForm';
import Sortable from 'sortablejs';
export default {
	components: {
		Group,
		GroupForm,
	},
	data() {
		return {
			isCreating: false,
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
			if(this.isCreating) {
				return;
			}
			this.isCreating = true;
		},
		...mapActions('board', [
			'createGroup',
			'updateBoard',
		]),
	},
}
</script>
