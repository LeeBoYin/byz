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
