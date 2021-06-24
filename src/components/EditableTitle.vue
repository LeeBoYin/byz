<template>
	<component
		:is="element"
		:class="[
			`editable-title--${ textAlign }`,
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
			:data-uid="_.uniqueId()"
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
		textAlign: {
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
			this.edit();
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
		edit() {
			if(this.disabled || this.isEditing) {
				return;
			}
			this.newTitle = this.title;
			this.isEditing = true;
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
		onClickEdit(e) {
			if(!this.clickable) {
				return;
			}
			e.stopPropagation();
			this.edit();
		},
		onDocumentClick(e) {
			if(e.target.isEqualNode(this.$refs.input)){
				// use data-uid to verify identical node
				return;
			}
			if(this.isEditing) {
				this.endEdit();
			}
		},
		onDoubleClickEdit(e) {
			if(!this.doubleClickable) {
				return;
			}
			e.stopPropagation();
			this.edit();
		},
	},
}
</script>
