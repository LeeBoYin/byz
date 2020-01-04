<template>
	<div>
		<component
			v-show="!isEditing"
			:is="tag"
			ref="title"
			@click="onEdit">
			{{ title }}
		</component>
		<input
			v-show="isEditing"
			ref="input"
			type="text"
			v-model.trim="newTitle"
			@click.stop
			@keypress.prevent.stop.enter="endEdit"
			@keydown.prevent.stop.esc="cancelEdit">
	</div>
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
		tag: String,
		title: String,
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
					this.cancelEdit();
				}
			});
		},
		cancelEdit() {
			this.isEditing = false;
		},
		endEdit() {
			if(!this.newTitle.length) {
				return;
			}
			if(this.newTitle === this.title) {
				this.isEditing = false;
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

<style scoped>

</style>