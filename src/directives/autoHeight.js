const autoHeight = (el) => {
	const borderHeight = el.offsetHeight - el.clientHeight;
	el.style.height = 'auto';
	el.style.height = (el.scrollHeight + borderHeight) + 'px';
};
export default {
	bind(el) {
		el.addEventListener('input', () => {
			autoHeight(el);
		});
	},
	inserted(el) {
		autoHeight(el);
	},
}
