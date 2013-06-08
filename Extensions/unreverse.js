//* TITLE Unreverse **//
//* VERSION 0.1 REV C **//
//* DESCRIPTION Unreversify the dashboard **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension puts the reblog/like/notes back where they were a few days ago. I have written this in less than 20 minutes, so it will probably have some bugs. Please use with caution. **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.unreverse = new Object({

	running: false,
	slow: true,

	run: function() {
		this.running = true;
		XKit.tools.init_css("unreverse");
		XKit.post_listener.add("unreverse", XKit.extensions.unreverse.do_posts);
		XKit.extensions.unreverse.do_posts();
	},
	
	do_posts: function() {
	
		$(".post").each(function() {
			var m_div = $(this).find(".post_controls_inner");
			$(this).find(".post_notes").appendTo(m_div);
			if ($(this).find(".post_source").length > 0) {
				$(this).find(".post_source").appendTo($(this));
				$(this).css("padding-bottom","30px");	
			}
		});	
		
	},

	destroy: function() {
		XKit.tools.remove_css("unreverse");
		XKit.post_listener.remove("unreverse");
		this.running = false;
	}

});