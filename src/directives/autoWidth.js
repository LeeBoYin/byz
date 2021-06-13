const autoWidth = (el) => {
	const borderWidth = el.offsetWidth - el.clientWidth;
	el.style.width = 'auto';
	el.style.width = (el.scrollWidth + borderWidth) + 'px';
};
export default {
	bind(el, binding) {
		if(!binding.value) {
			return;
		}
		el.addEventListener('input', () => {
			autoWidth(el);
		});
	},
	inserted(el, binding) {
		if(!binding.value) {
			return;
		}
		autoWidth(el);
	},
}
