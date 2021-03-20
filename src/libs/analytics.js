import { analytics } from '@/main';
import store from '@/store';

export const logEvent = (eventName, properties) => {
	properties = _.pickBy({
		board_id: store.getters['board/boardId'],
		board_group_count: store.getters['board/groupCount'],
		board_post_count: store.getters['board/postCount'],
		board_user_count: store.getters['board/userCount'],
		...properties,
	}, value => !_.isUndefined(value));
	console.log(eventName, properties);
	analytics.logEvent(eventName, properties);
};
