<template>
	<div
		:class="[
			`avatar--${ size }`,
			{
				'avatar--inactive': inactive,
			}
		]"
		class="avatar"
	>
		<div
			class="avatar__inner"
			:style="{ 'background-color': color || randomColor }"
		>
			{{ abbr }}
		</div>
	</div>
</template>

<script>
import constants from '@/constants';
export default {
	props: {
		color: {
			type: String,
			default: null,
		},
		name: {
			type: String,
			required: true,
		},
		size: {
			type: String,
			default: 'md',
		},
    inactive: {
		  type: Boolean,
      default: false,
    },
	},
	data() {
		return {
			randomColor: _.head(_.shuffle(constants.avatarColors)),
		};
	},
	computed: {
		abbr() {
			const words = _.words(this.name);
			if(words.length === 0) {
				return '-';
			}
			if(words.length === 1) {
				return words[0][0] + _.get(words[0], [1], '');
			}
			return `${ words[0][0] }${ words[1][0] }`;
		},
	},
};
</script>
