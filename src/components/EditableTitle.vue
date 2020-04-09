<template>
	<component :is="element" class="editable-title">
		<div
			v-show="!isEditing"
			ref="title"
			class="editable-title__span"
			@click="onEdit">
			{{ title }}
		</div>
		<input
			v-show="isEditing"
			ref="input"
			type="text"
			v-model.trim="newTitle"
			:placeholder="placeholder"
			class="editable-title__input"
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
		placeholder: String,
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
@import '~@style/custom';
.editable-title {
	* {
		line-height: 1.5;
		letter-spacing: 1px;
	}
	&__span {
		cursor: pointer;
	}
	&__input {
		background-color: transparent;
		border-radius: 0;
		border: 0;
		box-shadow: 0 1px 0 0 $c-gray-light;
		padding: 0px;
		font-size: inherit;
	}
}

</style>
