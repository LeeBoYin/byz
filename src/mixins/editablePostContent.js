export default {
	data() {
		return {
			editedContent: null,
			originalContent: null,
			isEditing: false,
			isSaving: false,
		};
	},
	beforeDestroy() {
		document.removeEventListener('mousedown', this.onDocumentClick);
	},
	mounted() {
		document.addEventListener('mousedown', this.onDocumentClick);
	},
	methods: {
		async onSave() {
			if(!this.isEditing) {
				return;
			}
			if(this.originalContent === this.editedContent) {
				this.isEditing = false;
				return;
			}
			this.isSaving = true;
			await this.save();
			this.isSaving = false;
			this.isEditing = false;
		},
		cancelEdit() {
			this.isEditing = false;
		},
		onClickEdit(originalContent) {
			this.originalContent = originalContent;
			this.editedContent = originalContent;
			this.isEditing = true;
		},
		onDocumentClick(e) {
			if(e.target.isEqualNode(this.$refs.textarea)){
				return;
			}
			if(this.isEditing) {
				this.onSave();
			}
		},
		onEditPressEnter(e) {
			if(e.ctrlKey || e.shiftKey || e.altKey) {
				// 換行
				return;
			}
			e.preventDefault();
			this.onSave();
		},
	},
};
