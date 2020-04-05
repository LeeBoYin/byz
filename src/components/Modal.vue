<template>
	<div :class="{ 'modal--open': isOpen }" class="modal">
		<div ref="modalContent" class="modal__content">
			<!-- header -->
			<div v-if="title" class="modal__header">
				<a class="modal__close" @click="$emit('close')">
					<i class="las la-times"></i>
				</a>
				<div class="modal__title">
					{{ title }}
				</div>
			</div>
			<!-- body -->
			<div class="modal__body">
				<slot name="body"></slot>
			</div>
			<!-- footer -->
			<div class="modal__footer">
				<slot name="footer"></slot>
			</div>
		</div>
		<div class="modal__overlay" @click="$emit('close')"></div>
	</div>
</template>

<script>
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
			this.$refs.modalContent.addEventListener('transitionend', () => {
				this.$emit('opened');
			}, { once: true });
		},
		onClose() {
			this.$emit('closing');
			this.$refs.modalContent.addEventListener('transitionend', () => {
				this.$emit('closed');
			}, { once: true });
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

<style lang="scss" scoped>
@import '~@style/custom';
$header-font-size: 24px;
$header-padding: 15px;
.modal {
	&__content {
		display: flex;
		flex-direction: column;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		width: 50%;
		margin: auto;
		border-radius: $border-r-lg;
		overflow: hidden;
		background-color: $c-bright;
		z-index: $z-index-modal;
		visibility: hidden;
		opacity: 0;
		transition: top .3s, opacity .3s, visibility 0s .3s;
	}
	&--lg &__content {
		width: 100%;
		max-width: 960px;
	}
	&--md &__content {
		width: 100%;
		max-width: 680px;
	}
	&--sm &__content {
		width: 100%;
		max-width: 480px;
	}
	&--open &__content {
		visibility: visible;
		opacity: 1;
		top: 20%;
		transition: top .3s, opacity .3s, visibility 0s;
	}
	&__header {
		position: relative;
		flex: 0 0;
		font-size: $header-font-size;
		line-height: 1;
		padding: $header-padding;
		border-bottom: 1px solid #EEE;
		display: flex;
		align-items: center;
	}
	&__title {
		font-weight: bold;
		position: relative;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin: 0 ($header-padding + $header-font-size);
		flex: 1 1 auto;
		text-align: center;
	}
	&__close {
		position: absolute;
		top: 0px;
		right: 0;
		line-height: 0;
		padding: $header-padding;
	}

	&__body {
		flex: 1 1 auto;
		overflow: auto;
	}
	&__footer {
		flex: 0 0 auto;
		&:not(:empty) {
			border-top: 1px solid #EEE;
		}
	}
	&__overlay {
		visibility: hidden;
		position: fixed;
		left: 0;
		top: 0;
		width:100%;
		height:100%;
		opacity: 0;
		background-color: rgba(0,0,0,0.6);
		transition: opacity .3s, visibility 0s .3s;
		z-index: $z-index-modal-overlay;
	}
	&--open &__overlay {
		opacity: 1;
		visibility: visible;
		transition: opacity .3s, visibility 0s;
	}
}
</style>
