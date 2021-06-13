<template>
	<div :class="{ 'modal-confirm--open': isOpen }" class="modal-confirm" @click.self="!buttonCloseOnly && $emit('cancel')">
		<div class="modal-confirm__content">
			<LayoutList gap="4" padding-x="8" padding-y="6" horizontal-align="center">
				<div v-if="title" class="modal-confirm__title">
					{{ title }}
				</div>
				<div class="modal-confirm__msg">
					{{ msg }}
				</div>
				<LayoutListInline gap="3">
					<button class="modal-confirm__btn-cancel" @click="$emit('cancel')">
						Cancel
					</button>
					<button class="modal-confirm__btn-confirm" @click="$emit('confirm')">
						{{ buttonText }}
					</button>
				</LayoutListInline>
			</LayoutList>
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
