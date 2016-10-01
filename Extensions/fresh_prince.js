//* TITLE Fresh Prince **//
//* VERSION 0.0.1 **//
//* DESCRIPTION Everything's flipped, turned upside down **//
//* DEVELOPER new-xkit **//
//* DETAILS This extension flips everything on the dashboard. Don't expect Tumblr to function correctly whatsoever while this extension is installed. **//
//* FRAME false **//
//* SLOW true **//
//* BETA false **//

XKit.extensions.fresh_prince = new Object({

	running: false,

	run: function() {
		this.running = true;
		XKit.tools.add_css(".l-header-container, .l-container, .l-footer-container { transform: rotate(180deg); -webkit-transform: rotate(180deg); }", "fresh_prince");
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("fresh_prince");
	}
});
