import './style/custom.scss';

// firebase
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from '../firebase.config';
const project = firebase.initializeApp(firebaseConfig);

// vue
import Vue from 'vue';
import router from '@/router';
import store from '@/store';

// use _ in all of vue component template
Object.defineProperty(Vue.prototype, '_', { value: _ });

new Vue({
	el: '#app',
	store,
	router,
	created() {
		this.$store.dispatch('init');
	},
});
