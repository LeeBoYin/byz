<template>
	<ModalContent
		:is-open="isOpen"
		size="md"
		class="modal-about"
		@close="$emit('close')">
		<div slot="body" class="modal-about__body">
			<LayoutList gap="5" padding-x="8" padding-y="6">
				<p>
					<b>BYZ</b>
					is a web app developed️ independently with ❤ by
					<a
						href="https://leeboy.in"
						target="_blank"
						rel="noopener"
						class="modal-about__link"
						@click="onClickCreatorLink"
					>BoYin Lee</a>
					as a side project.
					If you have any feedback or suggestion to BYZ, please feel free to
					<a
						href="https://forms.gle/trfNZq9e6DTVjaHH7"
						target="_blank"
						rel="noopener"
						class="modal-about__link"
						@click="onClickFeedbackLink"
					>share your idea</a>.
				</p>
				<p>If you like BYZ and find it useful in your work, you can buy me a coffee to support the creator of this project.</p>
				<LayoutAlign horizontal-align="center">
					<a
						href="https://www.buymeacoffee.com/leeboyin"
						target="_blank"
						rel="noopener"
						class="modal-about__buy-me-a-coffee-button"
						@click="onClickBuyMeACoffee"
					>
						<img
							src="/static/buy-me-a-coffee-btn-yellow.png"
							alt="buy me a coffee"
						>
					</a>
				</LayoutAlign>
			</LayoutList>
		</div>
	</ModalContent>
</template>

<script>
import ModalContent from '@components/ModalContent';
import { logEvent } from '@libs/analytics';
export default {
	components: {
		ModalContent,
	},
	props: ['isOpen'],
	methods: {
		onClickCreatorLink() {
			logEvent('creator_link_clicked');
		},
		onClickFeedbackLink() {
			logEvent('feedback_link_clicked');
		},
		onClickBuyMeACoffee() {
			logEvent('buy_me_a_coffee_button_clicked');
		},
	},
};
</script>
