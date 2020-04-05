<template>
	<div class="group-list">
		<Group v-for="group in orderedGroups" :key="group.id" :group="group" />
		<button class="group-list__btn-add" @click="onClickCreate">
			<i v-if="isLoading" class="las la-circle-notch la-spin la"></i>
			<template v-else>
				<i class="las la-plus"></i>
			</template>
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
			isLoading: false,
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
			if(this.isLoading) {
				return;
			}
			this.isLoading = true;
			await this.createGroup();
			this.isLoading = false;
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
		width: 300px;
		flex-shrink: 0;
		display: flex;
		align-items: center;
		justify-content: center;
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
	.group {
		margin-right: 15px;
	}
}
</style>
