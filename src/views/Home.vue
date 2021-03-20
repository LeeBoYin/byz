<template>
	<div class="frow centered-column">
		<Card>
			<div class="text-center">
				<h1 class="mb-25">Welcome to BYZ</h1>
				<button class="btn btn--primary" @click="$router.push({ name: 'CreateBoard' })">
					Create a Board
					<i class="las la-arrow-right"></i>
				</button>
			</div>
		</Card>
	</div>
</template>

<script>
import Card from '@components/Card';
import { logEvent } from '@libs/analytics';
export default {
	components: {
		Card,
	},
	mounted() {
		logEvent('home_loaded');
	},
};
</script>
