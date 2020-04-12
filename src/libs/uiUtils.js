export function errorShake(element) {
	if(element.classList.contains('error-shake')) {
		return;
	}
	element.addEventListener('animationend', () => {
		element.classList.remove('error-shake');
	}, { once: true });
	element.classList.add('error-shake')
}
