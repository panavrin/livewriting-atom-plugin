var $ = require('jquery'),
	ResizableWidthView = require('./utils/resizable-width-view'),
	angular = require('angular'),
	_ = require('underscore'),
	helpers = require('atom-helpers'),
	pfs = require('./utils/promised_fs'),
	path = require('path'),
	livewriting = require('livewriting'),
	TreeViewOpenFilesView = require('./tree-view-open-files-view');

module.exports = UIView;

function UIView() {
	UIView.__super__.constructor.apply(this, arguments);

	this.element = $('<div />').addClass('livewriting panel');

	this.app = angular.module('example', []);
	require('./controllers/example_controller')(this.app);

	this.panel = atom.workspace.addRightPanel({
		item: this.element
	});
	pfs.readFile(path.join(__dirname, './views', 'example.view.html'), 'utf8').then(_.bind(function(contents) {
		this.element.html(contents);
		angular.element(this.getElement()).ready(_.bind(function() {
			angular.bootstrap(this.getElement(), ['example']);
			this.show();
		}, this));
	}, this), function(err) {
		console.error(err);
	})
	this.getElement()[0].setAttribute("style","width:250px");
}

(function(My) {
	helpers.extends(My, ResizableWidthView);

	var proto = My.prototype;

	proto.getElement = function() {
		return this.element;
	};
	proto.show = function() {
		this.panel.show();
	};

	proto.destroy = function() {
	};
	proto.toggle = function(title) {
	};
}(UIView));
