var UIView = require('./uiview');
console.log('loaded');

module.exports = {
    activate: function(state) {
		this.view = new UIView();
		atom.commands.add('atom-workspace', 'atom-codeon:toggle-recording', this.toggle.bind(this));
    },
    serialize: function() {
		return {};
    },
    deactivate: function() {
		response.destroy();
    },
	toggle: function() {
		// this.requestView.toggle();
		if(!atom.workspace.getTopPanels()[0].visible){
			this.view.openPrompt();
		}
	}
};
