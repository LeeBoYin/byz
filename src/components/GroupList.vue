<template>
	<div class="group-list">
		<Group
			v-for="group in orderedGroups"
			:key="group.id"
			:group="group"
			class="mr-15"
		/>
		<GroupForm
			v-if="isCreating"
			class="mr-15"
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
			handle: '.group__handle',
			dataIdAttr: 'data-group-id',
			ghostClass: "sortable-ghost",
			chosenClass: "sortable-chosen",
			dragClass: "sortable-drag",
			direction: 'horizontal',
			emptyInsertThreshold: 20,
			onStart(e) {
				// groupList.updateDraggedItem(e.item);
			},
			onEnd() {
				// groupList.updateDraggedItem(null);
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
		...mapMutations('board', [
			'updateDraggedItem',
		]),
		...mapActions('board', [
			'createGroup',
			'updateBoard',
		]),
	},
}
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.group-list {
	display: flex;
	flex-wrap: nowrap;
	&__btn-add {
		width: $w-group;
		flex-shrink: 0;
		border: 2px dashed $c-dark;
		border-radius: $border-r-md;
		color: $c-dark;
		font-size: 30px;
		opacity: 0.1;
		transition: opacity .1s;
		&:hover {
			opacity: 0.3;
		}
	}
}
</style>
