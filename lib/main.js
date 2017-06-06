var {requirePackages} = require('atom-utils');
var UIView = require('./uiview');

module.exports = {
  activate: function(state) {
    console.log("activated");
		atom.commands.add('atom-workspace', 'livewriting-atom-plugin:toggle', this.toggle.bind(this));
    this.view = new UIView();
    this.toggle();
  },
  serialize: function() {
		return {};
  },
  deactivate: function() {
    this.toggle();
    this.view = null;
		//response.destroy();
  },
	toggle: function() {
    if(this.view.panel == null){
      this.view.panel = atom.workspace.addRightPanel({
    		item: this.view.element
    	});
    } else {
      if(this.view.panel.isVisible()){
        this.view.panel.hide();
      } else {
        this.view.panel.show();
      }
    }
	}
};
