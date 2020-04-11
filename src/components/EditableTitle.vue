<template>
	<component :is="element" class="editable-title">
		<div
			v-show="!isEditing"
			ref="title"
			:data-uid="_.uniqueId()"
			class="editable-title__display"
			@click="onEdit">
			<div class="editable-title__text">
				{{ title }}
			</div>
			<i class="editable-title__icon-edit las la-pencil-alt"></i>
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
			document.addEventListener('mousedown', (e) => {
				if(e.target.isEqualNode(this.$refs.title)){
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
		padding: 0px;
		font-size: inherit;
	}
}

</style>
