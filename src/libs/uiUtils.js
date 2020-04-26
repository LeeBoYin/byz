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

export function ease (v, pow = 4) {
	return 1 - Math.pow(1 - v, pow);
}

// export function calculateCollapsedScale () {
// 	const collapsed = menuTitle.getBoundingClientRect();
//
// 	// Whereas the menu as a whole (title plus items) can act as
// 	// a proxy for the expanded state.
// 	const expanded = menu.getBoundingClientRect();
// 	return {
// 		x: collapsed.width / expanded.width,
// 		y: collapsed.height / expanded.height
// 	};
// }

export function createKeyframeAnimation ({
	isInverse = false,
	targetScale = { x: 1, y: 1 },
	animationName = 'animation',
	inverseAnimationName = 'inverseAnimation'
}) {
	let animation = '';
	let inverseAnimation = '';

	for (let step = 0; step <= 100; step++) {
		// Remap the step value to an eased one.
		let easedStep = ease(step / 100);
		if(isInverse) {
			easedStep = 1 - easedStep;
		}

		// Calculate the scale of the element.
		const xScale = 1 - (1 - targetScale.x) * easedStep;
		const yScale = 1 - (1 - targetScale.y) * easedStep;
		animation += `${step}% {transform: scale(${xScale}, ${yScale});}`;

		// And now the inverse for the contents.
		const invXScale = 1 / xScale;
		const invYScale = 1 / yScale;
		inverseAnimation += `${step}% {transform: scale(${invXScale}, ${invYScale});}`;
	}

	return {
		[animationName]: animation,
		[inverseAnimationName]: inverseAnimation,
	};
}

export function appendKeyframes(keyframes = {}) {
	const styleNode = document.createElement('style');
	styleNode.innerHTML = _.map(keyframes, (keyframe, name) => {
		return `@keyframes ${ name } {${ keyframe }}`;
	}).join(' ');
	document.querySelector('body').appendChild(styleNode);
	return styleNode;
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

export function animationendOnce(element, func = () => {}) {
	const handler = (e) => {
		if(e.target.isEqualNode(element)) {
			func();
			element.removeEventListener('animationend', handler);
		}
	};
	element.addEventListener('animationend', handler);
}

export function Flip(el, { transitionClass= 'on-transition' }) {
	let _first;
	let _last;
	let _invert;
	const first = () => {
		_first = el.getBoundingClientRect();
		return _first;
	};
	const last = () => {
		el.classList.remove(transitionClass);
		_last = el.getBoundingClientRect();
		return _last;
	};
	const invert = () => {
		_invert = {
			x: _first.x - _last.x,
			y: _first.y - _last.y,
			scaleX: _first.width / _last.width,
			scaleY: _first.height / _last.height,
		};
		el.style.willChange = 'transform, opacity';
		el.style.transform = `translate(${ _invert.x }px, ${ _invert.y }px) scale(${ _invert.scaleX }, ${ _invert.scaleY })`;
		el.style.opacity = 0.5;
console.log('_invert', JSON.stringify(_invert));
		return _invert;
	};
	const play = () => {
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				el.classList.add(transitionClass);
				el.style.transform = '';
				el.style.opacity = '';
				el.style.willChange = '';
			});

			// end
			transitionendOnce(el, () => {
				el.classList.remove(transitionClass);
				resolve();
			});
		});
	};
	return {
		first,
		last,
		invert,
		play,
	};
}
