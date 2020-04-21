let tooltipEl = null;
let currentEl = null;
let removeTimeout = null;
const body = document.getElementsByTagName('body')[0];
const showTooltip = (el, text) => {
	if(removeTimeout) {
		clearTimeout(removeTimeout);
		removeTimeout = null;
	}
	if(currentEl === el) {
		return;
	} else if(!!currentEl) {
		hideTooltip();
	}
	currentEl = el;
	tooltipEl = document.createElement('div');
	tooltipEl.appendChild(document.createTextNode(text));
	tooltipEl.classList.add('tooltip');
	tooltipEl.style.top = el.getBoundingClientRect().y + el.offsetHeight;
	tooltipEl.style.left = el.getBoundingClientRect().x + el.offsetWidth / 2;
	body.appendChild(tooltipEl);
};
const hideTooltip = () => {
	if(!tooltipEl) {
		return;
	}
	tooltipEl.remove();
	tooltipEl = null;
	currentEl = null;
	removeTimeout = null;
};
const onMouseleave = () => {
	removeTimeout = setTimeout(hideTooltip, 100);
};

export default {
	bind(el, binding) {
		el.addEventListener('mouseenter', () => {
			showTooltip(el, binding.value);
		});
		el.addEventListener('mouseleave', onMouseleave);
	},
}
