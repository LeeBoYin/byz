import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from './views/Home';
import CreateBoard from './views/CreateBoard';
import Board from './views/Board';
import NotFound from './views/NotFound';
Vue.use(VueRouter);
export default new VueRouter({
	routes: [
		{
			path: '/',
			alias: '/home',
			name: 'Home',
			component: Home,
		},
		{
			path: '/create',
			name: 'CreateBoard',
			component: CreateBoard,
		},
		{
			path: '/board/:id',
			name: 'Board',
			component: Board,
			props: true,
		},
		{
			path: '*' ,
			name: 'NotFound',
			component: NotFound,
		},
	],
	mode: 'history',
});
