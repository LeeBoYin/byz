<template>
	<div class="autocomplete-input">
		<input
			ref="input"
			:value="value"
			v-auto-focus="autoFocus"
			type="text"
			:disabled="disabled"
			:placeholder="placeholder"
			@input="onInputInput"
			@focus="onInputFocus"
			@keydown.prevent.up="onArrowKeyDown('up')"
			@keydown.prevent.down="onArrowKeyDown('down')"
			@keydown.prevent.esc="onEscKeyDown"
			@keypress.enter="onEnterKeyPress"
		>
		<div
			v-if="filteredOptions.length && isShowSelect"
			:key="typedValue"
			ref="select"
			class="autocomplete-input__select"
		>
			<div
				v-for="(option, index) in filteredOptions"
				:class="[
					option.class,
					{ 'autocomplete-input__option--focused': focusedIndex === index }
				]"
				class="autocomplete-input__option"
				@mousedown="onOptionClick(index)"
			>
				{{ option.text }}
				<div
					v-if="option.color"
					class="autocomplete-input__color"
					:style="{ 'background-color': option.color }"
				></div>
			</div>
		</div>
	</div>
</template>

<script>
import { scrollTopAnimate } from '@libs/uiUtils';

export default {
	props: {
		autoFocus: {
			type: Boolean,
			default: false,
		},
		disabled: {
			type: Boolean,
			default: false,
		},
		options: {
			type: Array,
			default: () => [],
		},
		placeholder: {
			type: String,
			default: '',
		},
		value: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			focusedIndex: null,
			isShowSelect: false,
			typedValue: '',
		};
	},
	computed: {
		filteredOptions() {
			if(!this.typedValue.length) {
				return [];
			}
			return _.sortBy(_.filter(this.options, (option) => {
				return _.startsWith(option.text, this.typedValue);
			}), 'text');
		},
	},
	watch: {
		focusedIndex() {
			if(this.focusedIndex === null) {
				this.$emit('input', this.typedValue);
				return;
			}
			this.$emit('input', this.filteredOptions[this.focusedIndex].text);
		},
	},
	beforeDestroy() {
		document.removeEventListener('mouseup', this.onDocumentClick);
	},
	mounted() {
		document.addEventListener('mouseup', this.onDocumentClick);
	},
	methods: {
		focus() {
			this.$refs.input.focus();
		},
		hideSelect() {
			this.isShowSelect = false;
		},
		onArrowKeyDown(direction) {
			const length = this.filteredOptions.length;
			if(this.focusedIndex === null) {
				if(direction === 'up') {
					this.focusedIndex = length - 1;
				} else if(direction === 'down') {
					this.focusedIndex = 0;
				}
			} else {
				if((direction === 'up' && this.focusedIndex === 0) || (direction === 'down' && this.focusedIndex === length - 1)) {
					this.focusedIndex = null;
				} else if(direction === 'up') {
					this.focusedIndex -= 1;
				} else if(direction === 'down') {
					this.focusedIndex += 1;
				}
			}
			this.$nextTick(() => {
				const select = this.$refs.select;
				const focusedOption = this.$el.querySelector('.autocomplete-input__option--focused');
				if(this.focusedIndex === null) {
					// scroll to top
					scrollTopAnimate(select, 0, 100);
				} else if(select.scrollTop > focusedOption.offsetTop) {
					// scroll up to show focusedOption
					scrollTopAnimate(select, focusedOption.offsetTop, 100);
				} else if(select.scrollTop + select.clientHeight < focusedOption.offsetTop + focusedOption.offsetHeight) {
					// scroll down to show focusedOption
					scrollTopAnimate(select, focusedOption.offsetTop + focusedOption.offsetHeight - select.clientHeight, 100);
				}
			});
		},
		onDocumentClick(e) {
			if(e.target.isEqualNode(this.$refs.input)){
				return;
			}
			this.hideSelect();
		},
		onEnterKeyPress(e) {
			this.hideSelect();
			this.$emit('keypress', e);
		},
		onEscKeyDown() {
			this.hideSelect();
		},
		onInputFocus() {
			this.showSelect();
		},
		onInputInput(e) {
			this.typedValue = e.target.value;
			this.$emit('input', this.typedValue);
			this.$nextTick(() => {
				this.showSelect();
			});
		},
		onOptionClick(index) {
			this.focusedIndex = index;
		},
		showSelect() {
			this.focusedIndex = null;
			this.isShowSelect = true;
			this.typedValue = this.value;
		},
	},
};
</script>
