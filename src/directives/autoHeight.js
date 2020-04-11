export default {
	bind(el) {
		el.addEventListener('input', () => {
			const borderHeight = el.offsetHeight - el.clientHeight;
			el.style.height = 'auto';
			el.style.height = (el.scrollHeight + borderHeight) + 'px';
		});
	}
}
