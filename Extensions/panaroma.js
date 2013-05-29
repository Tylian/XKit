//* TITLE Panaroma **//
//* VERSION 1.0 REV B **//
//* DESCRIPTION Widescreen dashboard **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* DETAILS This extension extends your dashboard to fit the screen. It this an experimental extension, and no support for it provided yet. **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.panaroma = new Object({

	running: false,
	slow: true,

	run: function() {
		this.running = true;
		XKit.tools.init_css("panaroma");
	},

	destroy: function() {
		XKit.tools.remove_css("panaroma");
		this.running = false;
	}

});
