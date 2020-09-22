import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@views/Home';
import CreateBoard from '@views/CreateBoard';
import Board from '@views/Board';
import NotFound from '@views/NotFound';
Vue.use(VueRouter);
const router =  new VueRouter({
	routes: [
		{
			path: '/',
			alias: '/home',
			name: 'Home',
			component: Home,
			meta: {
				title: 'Home - BYZ',
			},
		},
		{
			path: '/create',
			name: 'CreateBoard',
			component: CreateBoard,
			meta: {
				title: 'Create Board - BYZ',
			},
		},
		{
			path: '/board/:id/:action?',
			name: 'Board',
			component: Board,
			props: true,
			meta: {
				title: 'Board - BYZ',
			},
		},
		{
			path: '*' ,
			name: 'NotFound',
			component: NotFound,
			meta: {
				title: '404 - BYZ',
			},
		},
	],
	mode: 'history',
});

const DEFAULT_TITLE = 'BYZ';
router.afterEach((to, from) => {
	Vue.nextTick(() => {
		document.title = to.meta.title || DEFAULT_TITLE;
	});
});

export default router;
