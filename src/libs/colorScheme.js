const PREFERENCE_STORAGE_KEY = 'color-scheme';
const THEME_LIGHT = 'light';
const THEME_DARK = 'dark';
const DARK_MODE_CLASS = 'dark-mode';

const getUserPreferredColorScheme = () => {
	// user preferred
	const storedColorScheme = window.localStorage.getItem(PREFERENCE_STORAGE_KEY);
	if (storedColorScheme === THEME_LIGHT || storedColorScheme === THEME_DARK) {
		return storedColorScheme;
	}

	// system preference
	const prefersDarkScheme = window.matchMedia(`(prefers-color-scheme: ${ THEME_DARK })`);
	if (prefersDarkScheme.matches) {
		return THEME_DARK;
	}

	// default
	return THEME_LIGHT;
};

const setColorScheme = (colorScheme) => {
	if (colorScheme === THEME_DARK) {
		document.body.classList.add(DARK_MODE_CLASS);
	}
	if (colorScheme === THEME_LIGHT) {
		document.body.classList.remove(DARK_MODE_CLASS);
	}
};

const storeUserPreferredColorScheme = (colorScheme) => {
	if (colorScheme !== THEME_LIGHT && colorScheme !== THEME_DARK) {
		return;
	}
	window.localStorage.setItem(PREFERENCE_STORAGE_KEY, colorScheme);
}

const toggleColorScheme = () => {
	const wasDarkMode = document.body.classList.contains(DARK_MODE_CLASS);
	document.body.classList.toggle(DARK_MODE_CLASS);
	return wasDarkMode ? THEME_LIGHT : THEME_DARK;
};

const watchUserPreferredColorScheme = () => {
	// sync color scheme when it is changed in other tabs
	window.addEventListener('storage', (e) => {
		if (e.key === PREFERENCE_STORAGE_KEY) {
			setColorScheme(e.newValue);
		}
	});
}

export {
	getUserPreferredColorScheme,
	setColorScheme,
	storeUserPreferredColorScheme,
	toggleColorScheme,
	watchUserPreferredColorScheme,
};
