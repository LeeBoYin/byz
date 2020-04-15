export function errorShake(element) {
	animationOnce(element, 'error-shake', 0.4);
}

export function animationOnce(element, animationName, duration = 0.3, timeFunc = 'ease-out') {
	if(element.style.animationName) {
		return;
	}
	element.addEventListener('animationend', () => {
		element.style.animation = '';
	}, { once: true });
	element.style.animationName = animationName;
	element.style.animationIterationCount = 1;
	element.style.animationDuration = duration + 's';
	element.style.animationTimingFunction = timeFunc;
}

export function transitionendOnce(element, func = () => {}) {
	const handler = (e) => {
		if(e.target.isEqualNode(element)) {
			func();
			element.removeEventListener('transitionend', handler);
		}
	};
	element.addEventListener('transitionend', handler);
}
