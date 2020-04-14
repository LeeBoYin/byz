<template>
	<component :is="element" :class="{ 'editable-title--disabled': disabled }" class="editable-title">
		<div
			v-show="!isEditing"
			ref="title"
			:data-uid="_.uniqueId()"
			class="editable-title__display"
			@click="onEdit">
			<div class="editable-title__text">
				{{ title }}
			</div>
			<i v-if="!disabled" class="editable-title__icon-edit las la-pencil-alt"></i>
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
		if(!this.title) {
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
			if(!this.title.length) {
				return;
			}
			this.isEditing = false;
		},
		endEdit() {
			if(!this.newTitle.length) {
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

<style lang="scss" scoped>
@import '~@style/custom';
.editable-title {
	* {
		line-height: 1.5;
		letter-spacing: 1px;
	}
	&__display {
		cursor: pointer;
		display: flex;
		align-items: center;
		* {
			pointer-events: none;
		}
	}
	&__text {
		@extend %text-ellipsis;
	}
	&__icon-edit {
		margin-left: 5px;
		font-size: 0.8em;
		color: $c-gray;
		display: none;
	}
	&__display:hover &__icon-edit {
		display: block;
	}
	&__input {
		background-color: transparent;
		border-radius: 0;
		border: 0;
		box-shadow: 0 1px 0 0 $c-gray-light;
		padding: 0;
		font-size: inherit;
	}
	// disabled style
	&--disabled &__display {
		cursor: default;
	}
}

</style>
