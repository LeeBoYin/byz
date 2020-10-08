const trimPathSlash = (path) => {
	return _.join(_.filter(_.split(path, '/')), '/');
};

export {
	trimPathSlash,
};
