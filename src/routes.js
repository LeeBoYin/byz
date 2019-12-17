import Home from './views/Home.vue';
import CreateBoard from './views/CreateBoard.vue';
import Board from './views/Board.vue';
import NotFound from './views/NotFound.vue';
export default [
	{ path: '/', component: Home },
	{ path: '/create', component: CreateBoard },
	{ path: '/board', component: Board },
	{ path: '*' , component: NotFound },
];