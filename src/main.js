// firebase
import * as firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/firestore';
const firebaseConfig = {
	apiKey: "AIzaSyCHKfWTkCo3EijL_l2B4dmgOzcD4SKjqms",
	authDomain: "byz-post.firebaseapp.com",
	// databaseURL: "https://byz-post.firebaseio.com",
	projectId: "byz-post",
	// storageBucket: "byz-post.appspot.com",
	// messagingSenderId: "sender-id",
	appId: "1:157336684949:web:4188b99dd0fb20859c4e9c",
	// measurementId: "G-measurement-id",
};
const project = firebase.initializeApp(firebaseConfig);

// vue
import Vue from 'vue';

// vuex
import Vuex from 'vuex'
import storeObj from './store.js';
Vue.use(Vuex);
const store = new Vuex.Store(storeObj);

// vue router
import VueRouter from 'vue-router';
import routesArray from './routes.js';
Vue.use(VueRouter);
const router = new VueRouter({
	routes: routesArray,
	mode: 'history',
});

// use _ in all of vue component template
import _ from 'lodash';
Object.defineProperty(Vue.prototype, '_', { value: _ });

new Vue({
	el: '#app',
	store,
	router,
});