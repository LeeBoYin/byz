import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home';
import CreateBoard from './views/CreateBoard';
import Board from './views/Board';
import NotFound from './views/NotFound';
Vue.use(VueRouter);
export default new VueRouter({
	routes: [
		{ path: '/', component: Home },
		{ path: '/create', component: CreateBoard },
		{ path: '/board/:id', component: Board },
		{ path: '*' , component: NotFound },
	],
	// mode: 'history',
});