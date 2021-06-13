<template>
	<component
		:is="element"
		:class="[
			`editable-title--${ align }`,
			{
				'editable-title--disabled': disabled,
				'editable-title--clickable': clickable,
				'editable-title--auto-width': autoWidth,
			}
		]"
		class="editable-title"
		@click="onClickEdit"
		@dblclick="onDoubleClickEdit"
	>
		<div
			v-show="!isEditing"
			ref="display"
			class="editable-title__display"
		>
			{{ title }}
		</div>
		<input
			v-if="isEditing"
			ref="input"
			type="text"
			v-model.trim="newTitle"
			v-auto-focus
			v-auto-width="autoWidth"
			:placeholder="placeholder"
			class="editable-title__input"
			@click.stop
			@keypress.prevent.stop.enter="endEdit"
			@keydown.prevent.stop.esc="cancelEdit">
	</component>
</template>

<script>
import { errorShake } from '@libs/uiUtils';

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
		required: {
			type: Boolean,
			default: false,
		},
		clickable: {
			type: Boolean,
			default: false,
		},
		doubleClickable: {
			type: Boolean,
			default: false,
		},
		align: {
			type: String,
			default: 'left',
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		autoWidth: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		title() {
			this.isEditing = false;
		},
	},
	mounted() {
		this.bindEvents();
		if(this.required && !this.title) {
			this.onEdit();
		}
	},
	beforeDestroy() {
		document.removeEventListener('mousedown', this.onDocumentClick);
	},
	methods: {
		bindEvents() {
			document.addEventListener('mousedown', this.onDocumentClick);
		},
		cancelEdit() {
			this.$emit('cancel');
			if(this.required && !this.title.length) {
				return;
			}
			this.isEditing = false;
		},
		endEdit() {
			if(this.required && !this.newTitle.length) {
				if(this.title) {
					this.cancelEdit();
					errorShake(this.$refs.display);
				} else {
					if(this.$refs.input === document.activeElement) {
						errorShake(this.$refs.input);
					}
				}
				return;
			}
			if(this.newTitle === this.title) {
				this.cancelEdit();
				return;
			}
			this.$emit('update', this.newTitle);
		},
		onClickEdit() {
			if(!this.clickable) {
				return;
			}
			this.onEdit();
		},
		onDoubleClickEdit() {
			if(!this.doubleClickable) {
				return;
			}
			this.onEdit();
		},
		onDocumentClick(e) {
			if(e.target.isEqualNode(this.$refs.input)){
				return;
			}
			if(this.isEditing) {
				this.endEdit();
			}
		},
		onEdit() {
			if(this.disabled || this.isEditing) {
				return;
			}
			this.newTitle = this.title;
			this.isEditing = true;
		},
	},
}
</script>
