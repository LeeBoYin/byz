const ease = (value, easePower = 2) => {
	// https://youtu.be/ZPlYZRubXkU
	return 1 - Math.pow(1 - value, easePower);
};

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

export function scrollTopAnimate(element, toY, duration = 300, cb = () => {}) {
	const fromY = element.scrollTop;
	const delta = toY - fromY;
	const start = window.performance.now();
	const update = () => {
		const time = window.performance.now() - start;
		const percent = ease(Math.min(time / duration, 1), 5);
		const newY = fromY + delta * percent;
		element.scrollTop = newY;
		if (percent < 1) {
			window.requestAnimationFrame(update);
		} else {
			cb();
		}
	};

	window.requestAnimationFrame(update);
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
