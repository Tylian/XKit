//* TITLE Fresh Prince **//
//* VERSION 0.0.2 **//
//* DESCRIPTION Everything's flipped, turned upside down **//
//* DEVELOPER new-xkit **//
//* DETAILS This extension flips everything on the dashboard. Don't expect Tumblr to function correctly whatsoever while this extension is installed. **//
//* FRAME false **//
//* SLOW true **//
//* BETA false **//

XKit.extensions.fresh_prince = new Object({

	running: false,

	remove_fastdash: function() {
		XKit.tools.add_function(function() {
			var onResize = Tumblr.fastDashboard.options.boundOnResize;
			var onScroll = Tumblr.fastDashboard.options.boundOnScroll;
			if (!onResize || !onScroll) {
				return;
			}
			Tumblr.fastDashboard.destroy();
			window.xkit_restore_fastdash = function() {
				Tumblr.fastDashboard.options.boundOnResize = onResize;
				Tumblr.fastDashboard.options.boundOnScroll = onScroll;
				Tumblr.Events.on("DOMEventor:flatscroll", onScroll);
				Tumblr.Events.on("DOMEventor:flatresize", onResize);
			};
		}, true);
	},

	restore_fastdash: function() {
		XKit.tools.add_function(function() {
			window.xkit_restore_fastdash();
		}, true);
	},

	run: function() {
		this.running = true;
		XKit.tools.add_css(".l-header-container, .l-container, .l-footer-container {" +
				"transform: rotate(180deg);" +
				"-webkit-transform: rotate(180deg);" +
			"}", "fresh_prince");
		this.remove_fastdash();
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("fresh_prince");
		this.restore_fastdash();
	}
});
