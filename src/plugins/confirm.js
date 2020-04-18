import ModalConfirm from '@components/ModalConfirm';
export default {
	install(Vue, options) {
		// append container
		const container = document.createElement('div');
		container.setAttribute('id', 'confirm-container');
		document.body.appendChild(container);

		Vue.prototype.$confirm = ({
			title,
			msg,
			buttonText,
			onConfirm = () => {},
			onCancel = () => {},
			buttonCloseOnly,
		}) => {
			const ModalConfirmClass = Vue.extend(ModalConfirm);

			// mount component
			const component = new ModalConfirmClass({
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
				document.getElementById('confirm-container').appendChild(component.$el);
				window.requestAnimationFrame(() => {
					component.$props.isOpen = true;
				});
			});

			// on confirm
			component.$once('confirm', () => {
				component.$props.isOpen = false;
				onConfirm();
			});
			// on close
			component.$once('cancel', () => {
				component.$props.isOpen = false;
				onCancel();
			});
			component.$once('closed', () => {
				document.getElementById('confirm-container').removeChild(component.$el);
				component.$destroy();
			});
		};
	},
};
