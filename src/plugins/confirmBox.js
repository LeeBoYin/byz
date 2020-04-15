import ConfirmBox from '@components/ConfirmBox';
export default {
	install(Vue, options) {
		// append container
		const container = document.createElement('div');
		container.setAttribute('id', 'confirm-box-container');
		document.body.appendChild(container);

		Vue.prototype.$confirmBox = ({
			title,
			msg,
			buttonText,
			onConfirm = () => {},
			onCancel = () => {},
			buttonCloseOnly,
		}) => {
			const ConfirmBoxClass = Vue.extend(ConfirmBox);

			// mount component
			const component = new ConfirmBoxClass({
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
				document.getElementById('confirm-box-container').appendChild(component.$el);
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
				document.getElementById('confirm-box-container').removeChild(component.$el);
				component.$destroy();
			});
		};
	},
};
