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
    if((atom.workspace.getRightPanels()).length == 0){
      this.view = new UIView();
    }
    else {
      this.view.destroy();
      (atom.workspace.getRightPanels()[0]).destroy();
    }
	}
};
