<template>
	<div :class="{ 'modal-alert--open': isOpen }" class="modal-alert" @click.self="!buttonCloseOnly && $emit('close')">
		<div class="modal-alert__content">
			<div v-if="title" class="modal-alert__title">
				{{ title }}
			</div>
			<div class="modal-alert__msg">
				{{ msg }}
			</div>
			<button class="modal-alert__btn" @click="$emit('close')">
				{{ buttonText }}
			</button>
		</div>
	</div>
</template>

<script>
import { transitionendOnce } from '@libs/uiUtils';
export default {
	props: {
		isOpen: {
			type: Boolean,
			default: false,
		},
		title: {
			type: String,
			default: null,
		},
		msg: {
			type: String,
			default: null,
		},
		buttonText: {
			type: String,
			default: 'OK',
		},
		buttonCloseOnly: {
			type: Boolean,
			default: false,
		},
	},
	watch: {
		isOpen() {
			this.isOpen ? this.onOpen() : this.onClose();
		},
	},
	mounted() {
		this.bindEvents();
	},
	methods: {
		bindEvents() {
			document.addEventListener('keydown', (e) => {
				if(this.isOpen && e.code === 'Escape') {
					this.$emit('close');
				}
			});
		},
		onOpen() {
			this.$emit('opening');
			transitionendOnce(this.$el, () => {
				this.$emit('opened');
			});
		},
		onClose() {
			this.$emit('closing');
			transitionendOnce(this.$el, () => {
				this.$emit('closed');
			});
		},
	},
};
</script>
