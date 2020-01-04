<template>
	<div class="loading-msg">
		Loading...
	</div>
</template>

<style scoped>
.loading-msg {
	width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	animation: loading infinite both;
	animation-duration: 1s;
	animation-direction: alternate;
}
@keyframes loading {
	from {
		letter-spacing: 8px;
	}

	to {
		letter-spacing: 2px;
	}
}
</style>