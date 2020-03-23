<template>
	<component :is="element" class="title">
		<span
			v-show="!isEditing"
			ref="title"
			@click="onEdit">
			{{ title }}
		</span>
		<input
			v-show="isEditing"
			ref="input"
			type="text"
			v-model.trim="newTitle"
			placeholder="Group name"
			@click.stop
			@keypress.prevent.stop.enter="endEdit"
			@keydown.prevent.stop.esc="cancelEdit">
	</component>
</template>

<script>
export default {
	data() {
		return {
			isEditing: false,
			newTitle: null,
		};
	},
	props: {
		title: String,
		element: {
			type: String,
			default: 'div',
		},
	},
	watch: {
		title() {
			this.isEditing = false;
		},
	},
	mounted() {
		this.bindEvents();
		if(!this.title) {
			this.onEdit();
		}
	},
	methods: {
		bindEvents() {
			document.addEventListener('click', (e) => {
				if(e.target === this.$refs.title){
					return;
				}
				if(this.isEditing) {
					this.endEdit();
				}
			});
		},
		cancelEdit() {
			if(!this.title.length) {
				return;
			}
			this.isEditing = false;
		},
		endEdit() {
			if(!this.newTitle.length) {
				return;
			}
			if(this.newTitle === this.title) {
				this.cancelEdit();
				return;
			}
			this.$emit('update', this.newTitle);
		},
		onEdit() {
			this.newTitle = this.title;
			this.isEditing = true;
			this.$nextTick(() => {
				this.$refs.input.focus();
			});
		},
	},
}
</script>

<style lang="scss" scoped>
span {
	cursor: pointer;
}
</style>
