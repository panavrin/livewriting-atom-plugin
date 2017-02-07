var $ = require('jquery'),
	ResizableWidthView = require('./utils/resizable-width-view'),
	angular = require('angular'),
	_ = require('underscore'),
	helpers = require('atom-helpers'),
	pfs = require('./utils/promised_fs'),
	path = require('path');

module.exports = UIView;

function UIView() {
	UIView.__super__.constructor.apply(this, arguments);

	this.element = $('<div />').addClass('codeon recording-bar');

	this.app = angular.module('example', []);
	require('./controllers/example_controller')(this.app);

	this.panel = atom.workspace.addRightPanel({
		item: this.element
	});
	

	pfs.readFile(path.join(__dirname, 'views', 'example.view.html'), 'utf8').then(_.bind(function(contents) {
		this.element.html(contents);
		angular.element(this.getElement()).ready(_.bind(function() {
			angular.bootstrap(this.getElement(), ['example']);
			this.show();
		}, this));
	}, this), function(err) {
		console.error(err);
	});
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
