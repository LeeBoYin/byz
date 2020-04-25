<template>
	<div
		:class="[{ 'modal-content--open': isOpen }, `modal-content--${ size }`]"
		class="modal-content"
		@click.self="$emit('close')">
		<div ref="modalContent" class="modal-content__content">
			<!-- header -->
			<div v-if="title" class="modal-content__header">
				<a class="modal-content__close" @click="$emit('close')">
					<i class="las la-times"></i>
				</a>
				<div class="modal-content__title">
					{{ title }}
				</div>
			</div>
			<!-- body -->
			<div class="modal-content__body">
				<slot name="body"></slot>
			</div>
			<!-- footer -->
			<div class="modal-content__footer">
				<slot name="footer"></slot>
			</div>
		</div>
<!--		<div class="modal-content__overlay" @click="$emit('close')"></div>-->
	</div>
</template>

<script>
import { transitionendOnce } from '@libs/uiUtils';
const MODAL_STATE = 'modal-state';
if(window.history.state === MODAL_STATE) {
	window.history.back();
}
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
		size: {
			type: String,
			default: 'md',
		}
	},
	watch: {
		isOpen() {
			this.isOpen ? this.onOpen() : this.onClose();
		},
	},
	mounted() {
		this.addEventHandlers();
	},
	methods: {
		addEventHandlers() {
			window.addEventListener('popstate', this.popStateHandler);
		},
		onOpen() {
			window.history.pushState(MODAL_STATE, null);
			this.$emit('opening');
			transitionendOnce(this.$refs.modalContent, () => {
				this.$emit('opened');
			});
		},
		onClose() {
			this.$emit('closing');
			transitionendOnce(this.$refs.modalContent, () => {
				this.$emit('closed');
			});
			if(window.history.state === MODAL_STATE) {
				window.history.back();
			}
		},
		popStateHandler() {
			if(this.isOpen && window.history.state !== MODAL_STATE) {
				// close modal when history back
				this.$emit('close');
			}
		},
	},
};
</script>
