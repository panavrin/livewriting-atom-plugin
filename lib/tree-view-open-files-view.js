var {requirePackages} = require('atom-utils');
var {CompositeDisposable} = require('event-kit');
var _ = require('lodash');
var TreeViewOpenFilesPaneView = require('./tree-view-open-files-pane-view');

module.exports = class TreeViewOpenFilesView {
	constructor(serializeState) {
		// Create root element
		this.element = document.createElement('div');
		this.element.classList.add('tree-view-open-files');
		this.groups = [];
		this.paneSub = new CompositeDisposable;
		this.paneSub.add(atom.workspace.observePanes(pane => {
			this.addTabGroup(pane);
			var destroySub = pane.onDidDestroy(() => {
				destroySub.dispose();
				return this.removeTabGroup(pane);
			});
			return this.paneSub.add(destroySub);
		}));

		this.configSub = atom.config.observe('tree-view-open-files.maxHeight', maxHeight => {
			return this.element.style.maxHeight = maxHeight > 0 ? `${maxHeight}px` : 'none';
		});
		//this.element.style.maxHeight = '250px'; // ADDED LINE
	}

	addTabGroup(pane) {
		let group = new TreeViewOpenFilesPaneView();
		group.setPane(pane);
		this.groups.push(group);
		return this.element.appendChild(group.element);
	}

	removeTabGroup(pane) {
		let group = _.findIndex(this.groups, group => group.pane === pane);
		this.groups[group].destroy();
		return this.groups.splice(group, 1);
	}

	// Returns an object that can be retrieved when package is activated
	serialize() {}

	// Tear down any state and detach
	destroy() {
		this.element.remove();
		this.paneSub.dispose();
		return this.configSub.dispose();
	}

	// Toggle the visibility of this view
	toggle() {
		if (this.element.parentElement != null) {
			return this.hide();
		} else {
			return this.show();
		}
	}

	hide() {
		return this.element.remove();
	}

	show() {
		return requirePackages('tree-view').then((...args) => {
			let [treeView] = Array.from(args[0]);
			treeView.treeView.find('.tree-view-scroller').css('background', treeView.treeView.find('.tree-view').css('background'));
			return treeView.treeView.prepend(this.element);
		});
	}
};
