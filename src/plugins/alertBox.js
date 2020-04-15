import AlertBox from '@components/AlertBox';
export default {
	install(Vue, options) {
		// append container
		const container = document.createElement('div');
		container.setAttribute('id', 'alert-box-container');
		document.body.appendChild(container);

		Vue.prototype.$alertBox = ({
			title,
			msg,
			buttonText,
			onClose = () => {},
			onClosed = () => {},
			buttonCloseOnly,
		}) => {
			const AlertBoxClass = Vue.extend(AlertBox);

			// mount component
			const component = new AlertBoxClass({
				propsData: {
					title,
					msg,
					buttonText,
					buttonCloseOnly,
				},
			});
			component.$mount();

			// append to dom and open
			window.requestAnimationFrame(() => {
				document.getElementById('alert-box-container').appendChild(component.$el);
				window.requestAnimationFrame(() => {
					component.$props.isOpen = true;
				});
			});

			// on close
			component.$once('close', () => {
				component.$props.isOpen = false;
				onClose();
			});
			component.$once('closed', () => {
				document.getElementById('alert-box-container').removeChild(component.$el);
				component.$destroy();
				onClosed();
			});
		};
	},
};
