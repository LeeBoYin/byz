import ModalAlert from '@components/ModalAlert';
export default {
	install(Vue, options) {
		// append container
		const container = document.createElement('div');
		container.setAttribute('id', 'alert-container');
		document.body.appendChild(container);

		Vue.prototype.$alert = ({
			title,
			msg,
			buttonText,
			onClose = () => {},
			onClosed = () => {},
			buttonCloseOnly,
		}) => {
			const ModalAlertClass = Vue.extend(ModalAlert);

			// mount component
			const component = new ModalAlertClass({
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
				document.getElementById('alert-container').appendChild(component.$el);
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
				document.getElementById('alert-container').removeChild(component.$el);
				component.$destroy();
				onClosed();
			});
		};
	},
};
