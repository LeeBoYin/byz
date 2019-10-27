<template>
	<div id="app">
		<h1>
			{{ message }}
		</h1>
		<input type="text" v-model="message">
	</div>
</template>

<script>
	export default {
		data() {
			return {
				message: 'Hello World',
			};
		},
	};
</script>

<style>
	#app {
		font-size: 18px;
		font-family: 'Roboto', sans-serif;
		color: blue;
	}
</style>