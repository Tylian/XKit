Post Listener looks out for new posts to appear on the dashboard, which usually happens when the user scrolls down for a while. Use it to modify new posts when they appear on the user's dashboard.

	run: function() {
		
		XKit.post_listener.add("my_extension", XKit.extensions.my_extension.paint_red);
		XKit.extensions.my_extension.paint_red();
		
	},
	
	paint_red: function() {
	
		$(".post").not(".already-red").each(function() {
			// Add class so we wouldn't hit this post again.
			$(this).addClass("already-red");
			// Paint it red!
			$(this).("background","red");	
		});
		
	},
	
	destroy: function() {
		// Always remove the listener on destroy!
		XKit.post_listener.remove("my_extension");
	}