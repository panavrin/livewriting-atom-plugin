var UIView = require('./uiview');
console.log('loaded');

module.exports = {
    activate: function(state) {
		this.view = new UIView();
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
		if(!atom.workspace.getRightPanels()[0].visible){
    	this.view.openPrompt();
		}
	}
};
