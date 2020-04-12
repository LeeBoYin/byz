<template>
	<div>
		<LoadingMsg v-if="!isInitialized" />
		<template v-else>
			<div :class="{ 'board--expand': !isShowPostArea }" class="board">
				<div class="board__header">
					<MenuBar />
				</div>
				<div class="board__body">
					<div class="board__group-list-container">
						<GroupList class="" />
					</div>
					<div ref="postAreaContainer" class="board__post-area-container">
						<PostArea class="ml-20"/>
					</div>
				</div>
				<PostAreaButton class="board__btn-post-area" />
			</div>
			<ModalUserForm :is-open="!currentUser && !isGuestMode" />
		</template>
	</div>
</template>

<script>
import Group from '@components/Group';
import GroupList from '@components/GroupList';
import LoadingMsg from '@components/LoadingMsg';
import MenuBar from '@components/MenuBar';
import TrashCan from '@components/TrashCan';
import ModalUserForm from '@components/ModalUserForm';
import PostArea from '@components/PostArea';
import PostAreaButton from '@components/PostAreaButton';
export default {
	props: {
		id: { // $route.params.id
			required: true,
		},
	},
	components: {
		Group,
		GroupList,
		LoadingMsg,
		MenuBar,
		ModalUserForm,
		PostArea,
		PostAreaButton,
		TrashCan,
	},
	data() {
		return {
			newName: '',
		};
	},
	computed: {
		...mapState('board', [
			'isInitialized',
			'isGuestMode',
			'isShowPostArea',
		]),
		...mapGetters('board', [
			'currentUser',
		]),
	},
	watch: {
		isShowPostArea() {
			this.setPostAreaMargin();
		},
	},
	mounted() {
		this.init(this.id);
	},
	methods: {
		setPostAreaMargin() {
			if(this.isShowPostArea) { // show
				this.$refs.postAreaContainer.style.marginLeft = '';
			} else { // hide
				this.$refs.postAreaContainer.style.marginLeft = `-${ this.$refs.postAreaContainer.offsetWidth }px`;
			}
		},
		...mapActions('board', [
			'init',
			'renameBoard',
		]),
	},
};
</script>

<style lang="scss">
@import '~@style/custom';
.board {
	height: 100vh;
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	padding: 20px 15px;
	&__header {
		margin-bottom: 20px;
	}
	&__body {
		flex-grow: 1;
		display: flex;
		overflow: hidden;
	}
	&__group-list-container {
		@include custom-scrollbar(#dcd6c9, true);
		flex-grow: 1;
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;
		padding-bottom: 10px;
	}
	&__post-area-container {
		display: flex;
		position: relative;
		bottom: 0;
		right: 0;
		margin-left: 0;
		border-radius: 0;
		transform-origin: bottom right;
		transition: .2s ease-out .1s;
	}
	&--expand &__post-area-container {
		border-radius: 50%;
		bottom: 30px;
		right: 30px;
		opacity: 0.3;
		transform: scale(0);
		transition: .2s ease-out;
	}
	&__btn-post-area {
		visibility: hidden;
		opacity: 0;
		transform: scale(0);
		transition:
			opacity .2s ease-out,
			transform .2s ease-out,
			visibility 0s ease .2s;
		/*display: none;*/
	}
	&--expand &__btn-post-area {
		visibility: visible;
		opacity: 1;
		transform: scale(1);
		transition:
			opacity .1s ease-out .1s,
			transform .1s ease-out .1s,
			visibility 0s ease 0s;
		/*display: block;*/
	}
}
</style>
