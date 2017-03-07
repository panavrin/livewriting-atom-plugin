var {requirePackages} = require('atom-utils');
var UIView = require('./uiview');

module.exports = {
  activate: function(state) {
		atom.commands.add('atom-workspace', 'livewriting-atom-plugin:toggle', this.toggle.bind(this));
    },
    serialize: function() {
		return {};
    },
    deactivate: function() {
		response.destroy();
    },
	toggle: function() {
		// this.requestView.toggle();
    this.view = new UIView();
		if(!atom.workspace.getRightPanels()[0].visible){
    	this.view.openPrompt();
		}
	}
};
