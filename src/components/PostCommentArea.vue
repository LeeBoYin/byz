<template>
	<div
		:class="{
			'post-comment-area--open': isOpen,
		}"
		class="post-comment-area"
		style="overflow: hidden"
	>
		<div class="post-comment-area__inner">
			<div>Comments</div>
			<div class="list">
			</div>
			<div class="post-comment-area__form">
				<textarea class="post-comment-area__textarea" type="text" rows="1"></textarea>
			</div>
		</div>
	</div>
</template>

<script>
import { transitionendOnce } from '@libs/uiUtils';
export default {
	data() {
		return {
			isOpen: false,
		};
	},
	methods: {
		expand() {
			return new Promise((resolve) => {
				this.$el.classList.add('post-comment-area--open');
				const expandedHeight = this.$el.offsetHeight;
				this.$el.classList.remove('post-comment-area--open');

				// play
				requestAnimationFrame(() => {
					this.$el.style.height = expandedHeight;
					this.$el.style.overflow = 'hidden';
					this.isOpen = true;
				});
				// end
				transitionendOnce(this.$el, () => {
					this.$el.style.height = '';
					this.$el.style.overflow = '';
				});
			});
		},
		collapse() {
			return new Promise((resolve) => {
				const expandedHeight = this.$el.offsetHeight;
				this.$el.style.height = expandedHeight;

				// play
				requestAnimationFrame(() => {
					this.$el.style.height = '';
					this.$el.style.overflow = 'hidden';
					this.isOpen = false;
				});
				// end
				transitionendOnce(this.$el, () => {
					resolve();
				});
			});
		},
	},
};
</script>
