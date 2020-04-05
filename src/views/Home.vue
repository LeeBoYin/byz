<template>
	<div class="frow centered-column">
		<div class="board-home">
			<h1 class="mb-25">Welcome to BYZ</h1>
			<button class="btn btn--primary" @click="$router.push({ name: 'CreateBoard' })">
				Create a Board
				<i class="las la-arrow-right"></i>
			</button>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import '~@style/custom';
.board-home {
	@extend %board;
	@extend %board--float;
	text-align: center;
	width: 100%;
	max-width: $block-md;
}
</style>
