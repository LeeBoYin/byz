<template>
	<div
		:class="`avatar--${ size }`"
		class="avatar"
		:style="{ 'background-color': color || randomColor }"
	>
		{{ abbr }}
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
		}
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

<style lang="scss" scoped>
@import '~@style/custom';
.avatar {
	cursor: default;
	border-radius: 50%;
	text-transform: uppercase;
	text-align: center;
	color: $c-bright;
	transition: .2s;
	&--sm {
		font-size: 0;
		width: 12px;
		height: 12px;
		line-height: 12px;
	}
	&--md {
		font-size: 14px;
		width: 40px;
		height: 40px;
		line-height: 40px;
	}
	&--lg {
		font-size: 20px;
		width: 60px;
		height: 60px;
		line-height: 60px;
	}
}
</style>
