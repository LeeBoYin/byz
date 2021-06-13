<template>
	<div
		:class="{ 'options-dropdown--open': isOpen }"
		class="options-dropdown"
		@click.stop="toggleOptions">
		<div class="options-dropdown__container">
			<i
				ref="toggle"
				class="options-dropdown__toggle las la-ellipsis-v"
			></i>
			<div class="options-dropdown__dropdown" :style="dropDownStyle">
				<div
					v-for="(option, idx) in options"
					ref="option"
					:class="{
						'options-dropdown__option--disabled': option.isDisabled,
						'options-dropdown__option--danger': option.isDanger,
					}"
					class="options-dropdown__option layout-u-content-fill-height"
					:style="getOptionStyle(idx)"
					@mousedown.stop
					@click="onOptionClick(idx)"
				>
					<LayoutAlign vertical-align="center" horizontal-align="center">
						<i :class="option.iconClass"></i>
					</LayoutAlign>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { errorShake } from '@libs/uiUtils';

const ANIMATION_DURATION = 0.2;
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
		animationCloseInterval() {
			return this.animationOpenInterval / 2;
		},
		animationOpenInterval() {
			return this.options.length ? (ANIMATION_DURATION / this.options.length) : ANIMATION_DURATION;
		},
		dropDownStyle() {
			const style = {};
			if(!this.isOpen) {
				_.assign(style, {
					'transition-delay': this.options.length * this.animationCloseInterval + 's',
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
					'transition-duration': this.animationOpenInterval + 's',
					'transition-delay': this.animationOpenInterval * idx + 's',
				});
			} else {
				_.assign(style, {
					'transition-duration': this.animationCloseInterval + 's',
					'transition-delay': this.animationCloseInterval * (this.options.length - (idx + 1)) + 's',
				});
			}

			const translate = '1em';
			switch (this.direction) {
				case 'top':
					_.assign(style, {
						'top': this.isOpen ? 0 : translate,
					});
					break;
				case 'left':
					_.assign(style, {
						'left': this.isOpen ? 0 : translate,
					});
					break;
				case 'right':
					_.assign(style, {
						'right': this.isOpen ? 0 : translate,
					});
					break;
				case 'bottom':
				default:
					_.assign(style, {
						'bottom': this.isOpen ? 0 : translate,
					});
			}
			return style;
		},
		onOptionClick(idx) {
			const option = this.options[idx];
			if(option.isDisabled) {
				errorShake(this.$refs.option[idx]);
				return;
			}
			option.onClick();
			this.isOpen = false;
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
