<template>
	<span
		:class="{ 'options-dropdown--open': isOpen }"
		class="options-dropdown"
		:data-uid="_.uniqueId()"
		@click="toggleOptions">
		<div class="options-dropdown__container">
			<i
				ref="toggle"
				:data-uid="_.uniqueId()"
				class="options-dropdown__toggle las la-ellipsis-v"
			></i>
			<div class="options-dropdown__dropdown" :style="dropDownStyle">
				<div
					v-for="(option, idx) in options"
					:title="option.title"
					:class="{ 'options-dropdown__option--danger': option.isDanger }"
					class="options-dropdown__option"
					:style="getOptionStyle(idx)"
					@click="option.onClick"
				>
					<i :class="option.iconClass"></i>
				</div>
			</div>
		</div>
	</span>
</template>

<script>
const ANIMATION_INTERVAL = 0.08;
export default {
	props: {
		options: {
			type: Array,
			default: () => [],
		},
		direction: {
			type: String,
			default: 'bottom',
		},
	},
	data() {
		return {
			isOpen: false,
		};
	},
	computed: {
		dropDownStyle() {
			const style = {};
			if(!this.isOpen) {
				_.assign(style, {
					'transition-delay': this.options.length * ANIMATION_INTERVAL + 's',
				});
			}

			switch (this.direction) {
				case 'top':
					_.assign(style, {
						'flex-direction': 'column-reverse',
						'bottom': '100%',
						'left': '50%',
						'transform': 'translateX(-50%)',
					});
					break;
				case 'left':
					_.assign(style, {
						'flex-direction': 'row-reverse',
						'right': '100%',
						'top': '50%',
						'transform': 'translateY(-50%)',
					});
					break;
				case 'right':
					_.assign(style, {
						'flex-direction': 'row',
						'left': '100%',
						'top': '50%',
						'transform': 'translateY(-50%)',
					});
					break;
				case 'bottom':
				default:
					_.assign(style, {
						'flex-direction': 'column',
						'top': '100%',
						'left': '50%',
						'transform': 'translateX(-50%)',
					});
			}
			return style;
		},
	},
	mounted() {
		this.bindEvents();
	},
	methods: {
		bindEvents() {
			document.addEventListener('mousedown', (e) => {
				if(e.target.isEqualNode(this.$el) || e.target.isEqualNode(this.$refs.toggle)){
					return;
				}
				this.isOpen = false;
			});
		},
		getOptionStyle(idx) {
			const style = {};
			if(this.isOpen) {
				_.assign(style, {
					'transition-duration': ANIMATION_INTERVAL + 's',
					'transition-delay': ANIMATION_INTERVAL * idx + 's',
				});
			} else {
				_.assign(style, {
					'transition-duration': ANIMATION_INTERVAL + 's',
					'transition-delay': ANIMATION_INTERVAL * (this.options.length - (idx + 1)) + 's',
				});
			}

			const margin = '10px';
			const translate = '50px';
			switch (this.direction) {
				case 'top':
					_.assign(style, {
						'margin-bottom': margin,
						'top': this.isOpen ? 0 : translate,
					});
					break;
				case 'left':
					_.assign(style, {
						'margin-right': margin,
						'left': this.isOpen ? 0 : translate,
					});
					break;
				case 'right':
					_.assign(style, {
						'margin-left': margin,
						'right': this.isOpen ? 0 : translate,
					});
					break;
				case 'bottom':
				default:
					_.assign(style, {
						'margin-top': margin,
						'bottom': this.isOpen ? 0 : translate,
					});
			}
			return style;
		},
		toggleOptions(e) {
			if(!(e.target.isEqualNode(this.$el) || e.target.isEqualNode(this.$refs.toggle))) {
				// 允許點擊最外層 element 或 toggle icon
				return;
			}
			this.isOpen = !this.isOpen;
		},
	},
}
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.options-dropdown {
	display: inline-block;
	&--open {
		color: $c-gray-darker !important;
	}
	&__container {
		position: relative;
	}
	&__toggle {
		cursor: pointer;
	}
	&__dropdown {
		position: absolute;
		z-index: 50;
		display: flex;
		cursor: default;
		visibility: hidden;
		transition: visibility 0s;
	}
	&--open &__dropdown {
		visibility: visible;
	}

	&__option {
		position: relative;
		cursor: pointer;
		color: $c-gray;
		background-color: $c-bright;
		padding: 8px;
		border-radius: 50%;
		box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.3);
		opacity: 0;
		transform-origin: center center;
		transition-property: opacity, top, left, right, bottom;
		transition-timing-function: ease-out;
	}
	&--open &__option {
		opacity: 1;
		&:hover {
			transform: scale(1.1);
			color: $c-gray-darker;

		}
		&--danger:hover {
			color: $c-danger;
		}
	}
}
</style>
