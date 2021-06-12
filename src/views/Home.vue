<template>
	<LayoutAlign vertical-align="center">
		<Card>
			<LayoutList gap="5" horizontal-align="center">
				<h1>Welcome to BYZ</h1>
				<button class="btn btn--primary" @click="$router.push({ name: 'CreateBoard' })">
					Create a Board
					<i class="las la-arrow-right"></i>
				</button>
			</LayoutList>
		</Card>
	</LayoutAlign>
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
