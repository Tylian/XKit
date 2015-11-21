//* TITLE Responsive Dashboard **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Collapse parts of the dash to fit your window. **//
//* DEVELOPER BobbySig **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.responsive_dash = new Object({

	running: false,

	run: function() {
		this.running = true;
		XKit.tools.init_css("responsive_dash");
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("responsive_dash");
	}

});
