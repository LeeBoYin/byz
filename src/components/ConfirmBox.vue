<template>
	<div :class="{ 'confirm-box--open': isOpen }" class="confirm-box" @click.self="!buttonCloseOnly && $emit('cancel')">
		<div class="confirm-box__content">
			<div v-if="title" class="confirm-box__title">
				{{ title }}
			</div>
			<div class="confirm-box__msg">
				{{ msg }}
			</div>
			<div class="confirm-box__btn-container">
				<button class="confirm-box__btn btn--default" @click="$emit('cancel')">
					Cancel
				</button>
				<button class="confirm-box__btn btn--primary" @click="$emit('confirm')">
					{{ buttonText }}
				</button>
			</div>
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
					this.$emit('cancel');
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

<style lang="scss">
@import '~@style/custom';
.confirm-box {
	@include modal-box;
	&__btn-container {
		display: flex;
		justify-content: right;
	}
	&__btn {
		margin-left: 15px;
	}
}
</style>
