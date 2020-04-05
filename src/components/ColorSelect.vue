<template>
	<div class="color-select">
		<div
			v-for="color in colors" @click="onClickColor(color)"
			:class="{ 'color-select__option--selected': value === color }"
			class="color-select__option"
			:style="{ 'background-color': color }"
		>
			<div class="color-select__option-shadow" :style="{ 'background-color': color }"></div>
		</div>
	</div>
</template>

<script>
import constants from '@/constants';
export default {
	props: {
		value: {
			type: String,
		},
	},
	data() {
		return {
			colors: constants.avatarColors,
		};
	},
	methods: {
		getOptionStyle(color) {
			return {
				'background-color': color,
			};
		},
		onClickColor(color) {
			this.$emit('input', color);
		},
	},
};
</script>

<style lang="scss" scoped>
.color-select {
	&__option {
		cursor: pointer;
		display: inline-block;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		margin-left: 20px;
		position: relative;
		&-shadow {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
			opacity: 0.3;
			transform-origin: center center;
			transform: scale(1);
			transition: transform .1s ease-out;
		}
		&--selected &-shadow {
			transform: scale(1.5);
		}
	}
}
</style>
