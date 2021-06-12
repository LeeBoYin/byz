import '@style/vendor.scss';
import '@style/custom.scss';

// firebase
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/analytics';
import firebaseConfig from '../firebase.config';
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const analytics = firebaseApp.analytics();

// showdown
import showdown from 'showdown';
showdown.setFlavor('github');
export const showDownConverter = new showdown.Converter({
	openLinksInNewWindow: true,
	simplifiedAutoLink: true,
	simpleLineBreaks: true,
});

// vue
import Vue from 'vue';
import router from '@/router';
import store from '@/store';

// use _ in all of vue component template
Object.defineProperty(Vue.prototype, '_', { value: _ });

// directives
import autoFocus from '@directives/autoFocus';
import autoHeight from '@directives/autoHeight';
import tooltip from '@directives/tooltip';
Vue.directive('auto-focus', autoFocus);
Vue.directive('auto-height', autoHeight);
Vue.directive('tooltip', tooltip);

// plugins
import alert from '@plugins/alert';
import confirm from '@plugins/confirm';
Vue.use(alert);
Vue.use(confirm);

// register layout components
import vueLayoutComponents from 'vue-layout-system';
for(let name of Object.keys(vueLayoutComponents)) {
	Vue.component(name, vueLayoutComponents[name]);
}

new Vue({
	el: '#app',
	store,
	router,
	created() {
		this.$store.dispatch('init');
	},
});

export const EventBus = new Vue();
