//let TreeViewOpenFilesPaneView;
var {CompositeDisposable} = require('event-kit');
var _  = require('lodash');
var {$} = require('space-pen');

module.exports = class TreeViewOpenFilesPaneView {
	constructor() {
		this.items = [];
		this.activeItem = null;
		this.paneSub = new CompositeDisposable;

		this.element = document.createElement('ul');
		this.element.classList.add('list-tree', 'has-collapsable-children');
		let nested = document.createElement('li');
		nested.classList.add('list-nested-item', 'expanded');
		this.container = document.createElement('ul');
		this.container.classList.add('list-tree');
		let header = document.createElement('div');
		header.classList.add('list-item');

		let headerSpan = document.createElement('span');
		headerSpan.classList.add('name', 'icon', 'icon-file-directory');
		headerSpan.setAttribute('data-name', 'Active Files');
		headerSpan.innerText = 'Active Files';
		header.appendChild(headerSpan);
		nested.appendChild(header);
		nested.appendChild(this.container);
		this.element.appendChild(nested);

		$(this.element).on('click', '.list-nested-item > .list-item', function() {
			nested = $(this).closest('.list-nested-item');
			nested.toggleClass('expanded');
			return nested.toggleClass('collapsed');
		});
		let self = this;
		$(this.element).on('click', '.list-item[is=tree-view-file]', function() {
			return self.pane.activateItem(self.entryForElement(this).item);
		});

	}


	setPane(pane) {
		this.pane = pane;

		this.paneSub.add(pane.observeItems(item => {
			let listItem = document.createElement('li');
			listItem.classList.add('file', 'list-item');
			listItem.setAttribute('is', 'tree-view-file');

			// ORIGINAL CODE
			/**let closer = document.createElement('button');
			closer.classList.add('close-open-file');
			$(closer).on('click', () => {
				return pane.destroyItem(this.entryForElement(listItem).item);
			}
			);*/
			// BEGINNING OF MODIFICATIONS
			let switch_box = document.createElement('label');
			switch_box.classList.add('recording-switch');
			let recording = document.createElement('input');
			recording.setAttribute('type','checkbox');
			recording.classList.add('checkbox-recording');
			switch_box.appendChild(recording);

			listItem.appendChild(switch_box);
			let listItemName = document.createElement('span');
			listItemName.classList.add('name', 'icon', 'icon-file-text');
			listItemName.setAttribute('data-path', typeof item.getPath === 'function' ? item.getPath() : undefined);
			listItemName.setAttribute('data-name', typeof item.getTitle === 'function' ? item.getTitle() : undefined);
			listItem.appendChild(listItemName);
			this.container.appendChild(listItem);
			if (item.onDidChangeTitle != null) {
				let titleSub = item.onDidChangeTitle(() => {
					return this.updateTitle(item);
				});

				this.paneSub.add(titleSub);
			}
			if (item.onDidChangeModified != null) {
				this.paneSub.add(item.onDidChangeModified(modified => {
					return this.updateModifiedState(item, modified);
				}));
			}

			this.items.push({item, element: listItem});
			return this.updateTitle(item);
		}));

		this.paneSub.add(pane.observeActiveItem(item => {
			return this.setActiveEntry(item);
		}));

		this.paneSub.add(pane.onDidRemoveItem(({item}) => {
			return this.removeEntry(item);
		}));

		return this.paneSub.add(pane.onDidDestroy(() => this.paneSub.dispose()));
	}

	updateTitle(item, siblings, useLongTitle) {
		let entry;
		if (siblings == null) { siblings = true; }
		if (useLongTitle == null) { useLongTitle = false; }
		let title = item.getTitle();

		if (siblings) {
			for (entry of Array.from(this.items)) {
				if ((entry.item !== item) && ((typeof entry.item.getTitle === 'function' ? entry.item.getTitle() : undefined) === title)) {
					useLongTitle = true;
					this.updateTitle(entry.item, false, true);
				}
			}
		}

		if (useLongTitle && (item.getLongTitle != null)) {
			title = item.getLongTitle();
		}

		if (entry = this.entryForItem(item)) {
			return $(entry.element).find('.name').text(title);
		}
	}

	updateModifiedState(item, modified) {
		let entry = this.entryForItem(item);
		return (entry != null ? entry.element.classList.toggle('modified', modified) : undefined);
	}

	entryForItem(item) {
		return _.find(this.items, entry => entry.item === item);
	}

	entryForElement(item) {
		return _.find(this.items, entry => entry.element === item);
	}

	setActiveEntry(item) {
		if (item) {
			let entry;
			if (this.activeEntry != null) {
				this.activeEntry.classList.remove('selected');
			}
			if (entry = this.entryForItem(item)) {
				entry.element.classList.add('selected');
				return this.activeEntry = entry.element;
			}
		}
	}

	removeEntry(item) {
		let index = _.findIndex(this.items, entry => entry.item === item);

		if (index >= 0) {
			this.items[index].element.remove();
			this.items.splice(index, 1);
		}

		return (() => {
			let result = [];
			for (let entry of Array.from(this.items)) { 				result.push(this.updateTitle(entry.item));
			}
			return result;
		})();
	}

	// Returns an object that can be retrieved when package is activated
	serialize() {}

	// Tear down any state and detach
	destroy() {
		this.element.remove();
		return this.paneSub.dispose();
	}
};
