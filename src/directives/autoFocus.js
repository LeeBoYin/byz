// example from https://vuejs.org/v2/guide/custom-directive.html
export default {
	// When the bound element is inserted into the DOM...
	inserted: function (el) {
		// Focus the element
		el.focus()
	}
};
