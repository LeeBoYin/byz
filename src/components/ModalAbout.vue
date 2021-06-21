<template>
	<ModalContent
		:is-open="isOpen"
		size="md"
		class="modal-about"
		@close="$emit('close')">
		<div slot="body">
			<LayoutList gap="5" padding-x="8" padding-y="6">
				<LayoutAlign horizontal-align="center">
					<a
						href="https://leeboy.in"
						target="_blank"
						rel="noopener"
						@click="onClickCreatorLink">
						<img
							src="/static/leeboyin.jpg"
							alt="BoYin Lee"
							class="modal-about__creator-photo"
						>
					</a>
				</LayoutAlign>
				<p>
					<b>BYZ</b>
					is a web app developed️ independently with <i class="las la-heart"></i> by
					<a
						href="https://leeboy.in"
						target="_blank"
						rel="noopener"
						class="modal-about__link"
						@click="onClickCreatorLink"
					>BoYin Lee</a>
					as a side project.
					If you have any feedback or suggestion to BYZ, please feel free to share your idea.
				</p>
				<LayoutAlign horizontal-align="center">
					<a
						href="https://forms.gle/trfNZq9e6DTVjaHH7"
						target="_blank"
						rel="noopener"
						class="btn btn--primary"
						@click="onClickFeedbackLink"
					>
						<i class="las la-bullhorn"></i>
						Feedback
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
