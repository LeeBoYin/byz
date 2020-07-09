<template>
	<component :is="element" :class="[`editable-title--${ align }`, { 'editable-title--disabled': disabled, 'editable-title--clickable': clickable }]" class="editable-title">
		<div
			v-show="!isEditing"
			ref="title"
			:data-uid="_.uniqueId()"
			class="editable-title__display"
			@click="onClickEdit">
			<div class="editable-title__text">
				{{ title }}
			</div>
			<i v-if="!disabled && clickable" class="editable-title__icon-edit las la-pencil-alt"></i>
		</div>
		<input
			v-if="isEditing"
			ref="input"
			type="text"
			v-model.trim="newTitle"
			v-auto-focus
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
		align: {
			type: String,
			default: 'left',
		},
		disabled: {
			type: Boolean,
			default: false,
		}
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
					errorShake(this.$refs.title);
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
		onDocumentClick(e) {
			if(e.target.isEqualNode(this.$refs.title) || e.target.isEqualNode(this.$refs.input)){
				return;
			}
			if(this.isEditing) {
				this.endEdit();
			}
		},
		onEdit() {
			if(this.disabled) {
				return;
			}
			this.newTitle = this.title;
			this.isEditing = true;
		},
	},
}
</script>
